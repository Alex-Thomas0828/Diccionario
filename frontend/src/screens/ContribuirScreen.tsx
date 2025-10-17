// screens/ContribuirScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button, TextInput, Chip, useTheme, SegmentedButtons, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ContribuirScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'word' | 'phrase' | 'audio'>('word');
  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    semantica: '',
    categoria_gramatical: '',
    ejemplo: '',
    contexto_cultural: '',
    region: '',
    es_publico: true,
    dificultad: 'medio'
  });

  const categoriasGramaticales = [
    'Sustantivo', 'Verbo', 'Adjetivo', 'Adverbio', 'Pronombre',
    'Preposición', 'Conjunción', 'Interjección', 'Artículo'
  ];

  const regiones = [
    'Norte', 'Sur', 'Este', 'Oeste', 'Central', 'Costera', 'Montañosa'
  ];

  const nivelesDificultad = [
    { label: 'Básico', value: 'basico' },
    { label: 'Medio', value: 'medio' },
    { label: 'Avanzado', value: 'avanzado' }
  ];

  const handleSubmit = () => {
    // Validación básica
    if (!formData.word.trim() || !formData.definition.trim()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    Alert.alert(
      'Contribución Enviada',
      '¡Gracias por tu contribución! Será revisada por la comunidad.',
      [
        {
          text: 'OK',
          onPress: () => {
            setFormData({
              word: '',
              definition: '',
              semantica: '',
              categoria_gramatical: '',
              ejemplo: '',
              contexto_cultural: '',
              region: '',
              es_publico: true,
              dificultad: 'medio'
            });
          }
        }
      ]
    );
  };

  const renderWordForm = () => (
    <Card style={styles.formCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Contribuir Nueva Palabra
        </Text>

        <TextInput
          label="Palabra *"
          value={formData.word}
          onChangeText={(text) => setFormData({...formData, word: text})}
          style={styles.input}
          mode="outlined"
          placeholder="Escribe la palabra aquí..."
        />

        <Text style={styles.inputLabel}>Categoría Gramatical</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          <View style={styles.chipContainer}>
            {categoriasGramaticales.map((categoria) => (
              <Chip
                key={categoria}
                selected={formData.categoria_gramatical === categoria}
                onPress={() => setFormData({...formData, categoria_gramatical: categoria})}
                style={styles.chip}
                showSelectedOverlay
              >
                {categoria}
              </Chip>
            ))}
          </View>
        </ScrollView>

        <TextInput
          label="Semántica"
          value={formData.semantica}
          onChangeText={(text) => setFormData({...formData, semantica: text})}
          style={styles.input}
          mode="outlined"
          placeholder="Campo semántico o significado cultural..."
        />

        <TextInput
          label="Definición *"
          value={formData.definition}
          onChangeText={(text) => setFormData({...formData, definition: text})}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={3}
          placeholder="Describe el significado de la palabra..."
        />

        <TextInput
          label="Ejemplo de Uso"
          value={formData.ejemplo}
          onChangeText={(text) => setFormData({...formData, ejemplo: text})}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={2}
          placeholder="Ejemplo en una frase..."
        />

        <TextInput
          label="Contexto Cultural"
          value={formData.contexto_cultural}
          onChangeText={(text) => setFormData({...formData, contexto_cultural: text})}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={2}
          placeholder="Significado cultural, histórico o ritual..."
        />

        <Text style={styles.inputLabel}>Región de Uso</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
          <View style={styles.chipContainer}>
            {regiones.map((region) => (
              <Chip
                key={region}
                selected={formData.region === region}
                onPress={() => setFormData({...formData, region})}
                style={styles.chip}
                showSelectedOverlay
              >
                {region}
              </Chip>
            ))}
          </View>
        </ScrollView>

        <Text style={styles.inputLabel}>Nivel de Dificultad</Text>
        <SegmentedButtons
          value={formData.dificultad}
          onValueChange={(value) => setFormData({...formData, dificultad: value})}
          buttons={nivelesDificultad}
          style={styles.segmentedButtons}
        />

        <View style={styles.switchContainer}>
          <Text>Hacer pública esta contribución</Text>
          <Switch
            value={formData.es_publico}
            onValueChange={(value) => setFormData({...formData, es_publico: value})}
          />
        </View>
      </Card.Content>
    </Card>
  );

  const renderPhraseForm = () => (
    <Card style={styles.formCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Contribuir Frase o Expresión
        </Text>
        <Text style={styles.comingSoon}>Próximamente disponible</Text>
      </Card.Content>
    </Card>
  );

  const renderAudioForm = () => (
    <Card style={styles.formCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Contribuir Audio
        </Text>
        <Text style={styles.comingSoon}>Próximamente disponible</Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <Card style={[styles.headerCard, { backgroundColor: colors.primaryContainer }]}>
        <Card.Content>
          <Text variant="headlineSmall" style={[styles.headerTitle, { color: colors.onPrimaryContainer }]}>
            Contribuye al Diccionario
          </Text>
          <Text variant="bodyMedium" style={[styles.headerSubtitle, { color: colors.onPrimaryContainer }]}>
            Ayuda a preservar y enriquecer nuestra lengua ancestral
          </Text>
        </Card.Content>
      </Card>

      {/* Tipo de Contribución */}
      <Card style={styles.tabCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Tipo de Contribución
          </Text>
          <SegmentedButtons
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as any)}
            buttons={[
              { value: 'word', label: 'Palabra', icon: 'alphabetical' },
              { value: 'phrase', label: 'Frase', icon: 'format-quote-close' },
              { value: 'audio', label: 'Audio', icon: 'microphone' },
            ]}
            style={styles.mainSegmentedButtons}
          />
        </Card.Content>
      </Card>

      {/* Form Dinámico */}
      {activeTab === 'word' && renderWordForm()}
      {activeTab === 'phrase' && renderPhraseForm()}
      {activeTab === 'audio' && renderAudioForm()}

      {/* Botón de Envío */}
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        labelStyle={styles.submitButtonText}
        disabled={!formData.word.trim() || !formData.definition.trim()}
      >
        Enviar Contribución
      </Button>

      {/* Información de la Comunidad */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.infoTitle}>
            Tu Contribución es Importante
          </Text>
          <Text variant="bodyMedium" style={styles.infoText}>
            • Todas las contribuciones son revisadas por la comunidad{'\n'}
            • Ayudas a preservar la lengua para futuras generaciones{'\n'}
            • Enriqueces el conocimiento colectivo{'\n'}
            • Mantienes viva la cultura ancestral
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    opacity: 0.8,
  },
  tabCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  formCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  infoCard: {
    marginBottom: 32,
    borderRadius: 12,
    backgroundColor: '#e8f5e8',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  chipScroll: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  mainSegmentedButtons: {
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  submitButton: {
    marginVertical: 24,
    borderRadius: 8,
    paddingVertical: 6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  comingSoon: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
    marginVertical: 20,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2e7d32',
  },
  infoText: {
    lineHeight: 20,
    color: '#555',
  },
});