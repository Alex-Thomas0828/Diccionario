import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { DictionaryAPI } from '../services/api';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

/**
 * Pantalla para crear o editar palabras en el diccionario
 * 
 * @param {Object} route - Contiene los parámetros de navegación
 * @param {Object} navigation - Objeto de navegación
 * 
 * @component
 * @example
 * <WordEditorScreen route={route} navigation={navigation} />
 */
type Props = NativeStackScreenProps<RootStackParamList, 'WordEditor'>;

export default function WordEditorScreen({ route, navigation }: Props) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializa el formulario si está en modo edición
  useEffect(() => {
    if (route.params?.word) {
      setWord(route.params.word.word);
      setDefinition(route.params.word.definition);
      setIsEditing(true);
      navigation.setOptions({ title: 'Editar Palabra' });
    } else {
      navigation.setOptions({ title: 'Nueva Palabra' });
    }
  }, [route.params]);

  /**
   * Maneja el envío del formulario
   * @async
   */
  const handleSubmit = async () => {
    if (!word.trim() || !definition.trim()) {
      Alert.alert('Error', 'Ambos campos son requeridos');
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

    try {
      setLoading(true);
      setError(null);

      if (isEditing && route.params?.word) {
        await DictionaryAPI.updateWord(route.params.word.id, { word, definition });
        Alert.alert('Éxito', 'Palabra actualizada correctamente');
      } else {
        await DictionaryAPI.createWord({ word, definition });
        Alert.alert('Éxito', 'Palabra creada correctamente');
      }
      
      navigation.goBack();
    } catch (err) {
      let errorMessage = 'Error al guardar la palabra';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
 * Maneja la eliminación de una palabra
 * @async
 */
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
    <View style={styles.container}>
      <TextInput
        label="Palabra"
        value={word}
        onChangeText={setWord}
        style={styles.input}
        disabled={loading}
        maxLength={100}
      />
      
      <TextInput
        label="Definición"
        value={definition}
        onChangeText={setDefinition}
        multiline
        numberOfLines={4}
        style={styles.input}
        disabled={loading}
        maxLength={2000}
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
        <Button 
          mode="outlined" 
          onPress={handleDelete}
          style={styles.button}
          color="#ff4444"
          disabled={loading}
        >
          Eliminar Palabra
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  input: { marginBottom: 16 },
  button: { marginTop: 8 },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center'
  }
});