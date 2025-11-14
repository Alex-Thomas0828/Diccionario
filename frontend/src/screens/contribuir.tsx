import { useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { DictionaryAPI } from '../services/api';
import { Picker } from '@react-native-picker/picker';

// Add category options at the top of your component
const CATEGORIAS_SEMANTICAS = [
  { label: 'Selecciona una categoría', value: '' },
  { label: 'Familia', value: 'familia' },
  { label: 'Naturaleza', value: 'naturaleza' },
  { label: 'Comida', value: 'comida' },
  { label: 'Animales', value: 'animales' },
  { label: 'Colores', value: 'colores' },
  { label: 'Números', value: 'numeros' },
];

const CATEGORIAS_GRAMATICALES = [
  { label: 'Selecciona una categoría', value: '' },
  { label: 'Sustantivo', value: 'sustantivo' },
  { label: 'Verbo', value: 'verbo' },
  { label: 'Adjetivo', value: 'adjetivo' },
  { label: 'Adverbio', value: 'adverbio' },
  { label: 'Pronombre', value: 'pronombre' },
];

export default function ContribuirScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [palabraAncestral, setPalabraAncestral] = useState('');
  const [significadoEspanol, setSignificadoEspanol] = useState('');
  const [ejemploUso, setEjemploUso] = useState('');
  const [categoriaSemantica, setCategoriaSemantica] = useState('');
  const [categoriaGramatical, setCategoriaGramatical] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!palabraAncestral.trim() || !significadoEspanol.trim()) {
      Alert.alert('Error', 'Los campos "Palabra en lengua ancestral" y "Significado en español" son obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      const wordData = {
        palabra: palabraAncestral.trim(), //changed from 'word'
        definicion: significadoEspanol.trim(), //changed from 'definition'
        ejemplo: ejemploUso.trim() || undefined,
        semantica: categoriaSemantica.trim() || undefined,
        categoria_grammatica: categoriaGramatical.trim() || undefined
      };

      console.log('Submitting word data:', wordData);

      const result = await DictionaryAPI.createWord(wordData);
      console.log('Word created successfully:', result);
      
      Alert.alert(
        'Contribución Enviada',
        'Tu palabra ha sido enviada para revisión. ¡Gracias por contribuir!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear form
              setPalabraAncestral('');
              setSignificadoEspanol('');
              setEjemploUso('');
              setCategoriaSemantica('');
              setCategoriaGramatical('');
            }
          }
        ]
      );
    } catch (err) {
      console.log('Error submitting word:', err);
      Alert.alert('Error', err.message || 'Ocurrió un error al enviar tu palabra. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
  };

    // Replace the DropdownField component with this:
  const DropdownField = ({ 
    label, 
    value, 
    onValueChange, 
    options 
  }: { 
    label: string; 
    value: string; 
    onValueChange: (value: string) => void;
    options: { label: string; value: string }[];
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {options.map((option) => (
            <Picker.Item 
              key={option.value} 
              label={option.label} 
              value={option.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.headerTitle}>Lengua Ancestral</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => handleNavigation('Home')}
          >
            <Text style={styles.headerButtonText}>🏠 Inicio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.headerButton, styles.activeButton]}
            onPress={() => handleNavigation('Contribuir')}
          >
            <Text style={styles.headerButtonText}>👤 Contribuir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => handleNavigation('Dictionary')}
          >
            <Text style={styles.headerButtonText}>⚙️ Administración</Text>
          </TouchableOpacity>
          
          <Text style={styles.adminText}>admin Administrador</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Title Section */}
        <Text style={styles.mainTitle}>Contribuir al Diccionario</Text>
        <Text style={styles.subtitle}>
          Ayuda a enriquecer nuestro diccionario de lengua ancestral agregando nuevas palabras.
        </Text>

        {/* Main Form Section */}
        <View style={styles.formSection}>
          <View style={styles.formHeader}>
            <Text style={styles.formIcon}>👤</Text>
            <View>
              <Text style={styles.formTitle}>Agregar Nueva Palabra</Text>
              <Text style={styles.formSubtitle}>
                Completa todos los campos para agregar una nueva palabra. Tu contribución será revisada por un 
                administrador antes de ser publicada.
              </Text>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formFields}>
            <View style={styles.fieldRow}>
              <View style={[styles.fieldContainer, styles.halfField]}>
                <Text style={styles.fieldLabel}>Palabra en lengua ancestral *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej: atl"
                  value={palabraAncestral}
                  onChangeText={setPalabraAncestral}
                />
              </View>
              
              <View style={[styles.fieldContainer, styles.halfField]}>
                <Text style={styles.fieldLabel}>Significado en español *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej: agua"
                  value={significadoEspanol}
                  onChangeText={setSignificadoEspanol}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Ejemplo de uso</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Ej: Atl kuali. (El agua es buena.)"
                value={ejemploUso}
                onChangeText={setEjemploUso}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.fieldHelp}>
                Proporciona un ejemplo de cómo se usa la palabra en contexto.
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <View style={[styles.fieldContainer, styles.halfField]}>
                <DropdownField
                  label="Categoría Semántica *"
                  value={categoriaSemantica}
                  onValueChange={setCategoriaSemantica}
                  options={CATEGORIAS_SEMANTICAS}
                />
              </View>
              
              <View style={[styles.fieldContainer, styles.halfField]}>
                <DropdownField
                  label="Categoría Gramatical*"
                  value={categoriaGramatical}
                  onValueChange={setCategoriaGramatical}
                  options={CATEGORIAS_GRAMATICALES}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, loading && styles.disabledButton]} 
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonIcon}>👤</Text>
              <Text style={styles.submitButtonText}>
                {loading ? 'Enviando...' : 'Enviar Palabra para Revisión'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sidebar Sections */}
        <View style={styles.sidebarContainer}>
          {/* Contributions Summary */}
          <View style={styles.sidebarCard}>
            <Text style={styles.sidebarTitle}>Tus Contribuciones</Text>
            <Text style={styles.sidebarSubtitle}>Resumen de tus palabras enviadas</Text>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total enviadas</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>⏳ Pendientes</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>✓ Aprobadas</Text>
              <Text style={[styles.statValue, styles.approvedBadge]}>0</Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Rechazadas</Text>
              <Text style={[styles.statValue, styles.rejectedBadge]}>0</Text>
            </View>
          </View>

          {/* Guidelines */}
          <View style={styles.sidebarCard}>
            <Text style={styles.sidebarTitle}>📚 Guías de Contribución</Text>
            
            <Text style={styles.guidelineTitle}>Consejos para una buena contribución:</Text>
            
            <View style={styles.guidelinesList}>
              <Text style={styles.guidelineItem}>• Verifica que la palabra no exista ya</Text>
              <Text style={styles.guidelineItem}>• Usa la ortografía correcta</Text>
              <Text style={styles.guidelineItem}>• Proporciona un ejemplo claro</Text>
              <Text style={styles.guidelineItem}>• Selecciona la categoría apropiada</Text>
              <Text style={styles.guidelineItem}>• Incluye el contexto cultural si es relevante</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  activeButton: {
    backgroundColor: '#374151',
  },
  headerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  adminText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  formSection: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    backgroundColor: '#ffffff',
  },
  formHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  formIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    maxWidth: 600,
  },
  formFields: {
    gap: 20,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 16,
  },
  fieldContainer: {
    flex: 1,
  },
  halfField: {
    flex: 0.5,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  fieldHelp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  pickerContainer: {
  borderWidth: 1,
  borderColor: '#d1d5db',
  borderRadius: 6,
  backgroundColor: '#f9fafb',
  overflow: 'hidden',
  },
  picker: {
    height: 50,
  },

  submitButton: {
    backgroundColor: '#1f2937',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  submitButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  sidebarContainer: {
    gap: 24,
  },
  sidebarCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  sidebarSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#374151',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  approvedBadge: {
    backgroundColor: '#1f2937',
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
  },
  rejectedBadge: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 12,
  },
  guidelineTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 12,
  },
  guidelinesList: {
    gap: 6,
  },
  guidelineItem: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});