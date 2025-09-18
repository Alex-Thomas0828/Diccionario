import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Button, TextInput, Menu, Divider } from 'react-native-paper';
import { DictionaryAPI } from '../services/api';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'WordEditor'>;

// Common grammatical categories
const GRAMMATICAL_CATEGORIES = [
  'Sustantivo',
  'Verbo',
  'Adjetivo',
  'Adverbio',
  'Pronombre',
  'Preposición',
  'Conjunción',
  'Interjección',
  'Determinante',
  'Artículo'
];

export default function WordEditorScreen({ route, navigation }: Props) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [semantica, setSemantica] = useState('');
  const [categoriaGramatical, setCategoriaGramatical] = useState('');
  const [ejemplo, setEjemplo] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Initialize form
  useEffect(() => {
    if (route.params?.word) {
      setWord(route.params.word.word);
      setDefinition(route.params.word.definition);
      setSemantica(route.params.word.semantica || '');
      setCategoriaGramatical(route.params.word.categoria_gramatical || '');
      setEjemplo(route.params.word.ejemplo || '');
      setIsEditing(true);
      navigation.setOptions({ title: 'Editar Palabra' });
    } else {
      navigation.setOptions({ title: 'Nueva Palabra' });
    }
  }, [route.params]);

  const handleSubmit = async () => {
    // Validation
    if (!word.trim() || !definition.trim() || !categoriaGramatical.trim()) {
      Alert.alert('Error', 'Palabra, definición y categoría gramatical son requeridos');
      return;
    }

    if (word.length > 100) {
      Alert.alert('Error', 'La palabra debe tener menos de 100 caracteres');
      return;
    }
    if (definition.length > 2000) {
      Alert.alert('Error', 'La definición debe tener menos de 2000 caracteres');
      return;
    }
    if (ejemplo.length > 500) {
      Alert.alert('Error', 'El ejemplo debe tener menos de 500 caracteres');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const wordData = {
        word,
        definition,
        semantica,
        categoria_gramatical: categoriaGramatical,
        ejemplo
      };

      if (isEditing && route.params?.word) {
        await DictionaryAPI.updateWord(route.params.word.id, wordData);
        Alert.alert('Éxito', 'Palabra actualizada correctamente');
      } else {
        await DictionaryAPI.createWord(wordData);
        Alert.alert('Éxito', 'Palabra creada correctamente');
      }
      
      navigation.goBack();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar la palabra';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      if (!isEditing || !route.params?.word) return;
      
      const success = await DictionaryAPI.deleteWord(route.params.word.id);
      if (success) {
        Alert.alert(
          'Éxito',
          'Palabra eliminada',
          [{ text: 'OK', onPress: () => navigation.navigate('Dictionary', { refresh: true }) }]
        );
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Error desconocido'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Palabra *"
        value={word}
        onChangeText={setWord}
        style={styles.input}
        disabled={loading}
        maxLength={100}
        mode="outlined"
      />
      
      <TextInput
        label="Categoria Gramatical"
        value={categoriaGramatical}
        onChangeText={setCategoriaGramatical}
        style={styles.input}
        disabled={loading}
        mode="outlined"
      />

      <TextInput
        label="Semántica"
        value={semantica}
        onChangeText={setSemantica}
        style={styles.input}
        disabled={loading}
        mode="outlined"
      />
      
      <TextInput
        label="Definición *"
        value={definition}
        onChangeText={setDefinition}
        multiline
        numberOfLines={4}
        style={styles.input}
        disabled={loading}
        maxLength={2000}
        mode="outlined"
      />
      
      <TextInput
        label="Ejemplo de uso"
        value={ejemplo}
        onChangeText={setEjemplo}
        multiline
        numberOfLines={3}
        style={styles.input}
        disabled={loading}
        maxLength={500}
        mode="outlined"
      />


      <Button 
        mode="contained" 
        onPress={handleSubmit}
        style={styles.button}
        loading={loading}
        disabled={loading}
      >
        {isEditing ? 'Actualizar' : 'Crear'}
      </Button>

      {isEditing && (
        <>
          <Divider style={styles.divider} />
          <Button 
            mode="outlined" 
            onPress={handleDelete}
            style={styles.button}
            textColor="#ff4444"
            disabled={loading}
          >
            Eliminar Palabra
          </Button>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    padding: 16 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  input: { 
    marginBottom: 16 
  },
  button: { 
    marginTop: 8,
    marginBottom: 8
  },
  divider: {
    marginVertical: 16
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center'
  }
});