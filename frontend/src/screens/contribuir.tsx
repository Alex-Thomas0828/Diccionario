import { useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { DictionaryAPI } from '../services/api';
import { Picker } from '@react-native-picker/picker';

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

  // Custom Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error' | 'duplicate'>('success');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (type: 'success' | 'error' | 'duplicate', title: string, message: string) => {
    console.log('📢 SHOWING MODAL:', { type, title, message });
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleModalAction = (action: 'addAnother' | 'viewDictionary' | 'close') => {
    hideModal();
    
    if (action === 'addAnother') {
      // Clear form
      setPalabraAncestral('');
      setSignificadoEspanol('');
      setEjemploUso('');
      setCategoriaSemantica('');
      setCategoriaGramatical('');
    } else if (action === 'viewDictionary') {
      navigation.navigate('Dictionary', {});
    }
  };

  const handleSubmit = async () => {
    console.log('🔵 handleSubmit called');
    
    // Validation
    if (!palabraAncestral.trim() || !significadoEspanol.trim()) {
      console.log('❌ Validation failed: missing required fields');
      showModal(
        'error',
        'Error',
        'Los campos "Palabra en lengua ancestral" y "Significado en español" son obligatorios'
      );
      return;
    }

    if (!categoriaSemantica.trim() || !categoriaGramatical.trim()) {
      console.log('❌ Validation failed: missing categories');
      showModal(
        'error',
        'Error',
        'Por favor selecciona ambas categorías (Semántica y Gramatical)'
      );
      return;
    }

    try {
      setLoading(true);
      
      const wordData = {
        palabra: palabraAncestral.trim(),
        definicion: significadoEspanol.trim(),
        ejemplo: ejemploUso.trim() || undefined,
        semantica: categoriaSemantica.trim(),
        categoria_grammatica: categoriaGramatical.trim()
      };

      console.log('🔵 Submitting word data:', wordData);

      const result = await DictionaryAPI.createWord(wordData);
      console.log('✅ SUCCESS! Word created:', result);
      
      // SUCCESS MODAL
      showModal(
        'success',
        '✓ Palabra Agregada',
        `La palabra "${palabraAncestral}" ha sido agregada exitosamente al diccionario. ¡Gracias por contribuir!`
      );
      
    } catch (err: any) {
      console.error('❌ CATCH BLOCK - Error submitting word:', err);
      console.error('❌ Error message:', err.message);
      
      // Handle duplicate word error specifically
      if (err.message && (err.message.includes('ya existe') || err.message.includes('DUPLICATE'))) {
        console.log('⚠️ DUPLICATE DETECTED IN FRONTEND');
        // DUPLICATE MODAL
        showModal(
          'duplicate',
          '⚠️ Palabra Duplicada',
          `La palabra "${palabraAncestral}" ya existe en el diccionario. Por favor verifica el diccionario o intenta con una palabra diferente.`
        );
      } else {
        // GENERIC ERROR MODAL
        showModal(
          'error',
          '✗ Error',
          err.message || 'No se pudo agregar la palabra. Por favor intenta de nuevo.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleNavigation = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
  };

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

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.mainTitle}>Contribuir al Diccionario</Text>
        <Text style={styles.subtitle}>
          Ayuda a enriquecer nuestro diccionario de lengua ancestral agregando nuevas palabras.
        </Text>

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
                  label="Categoría Gramatical *"
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
      </View>

      {/* Custom Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <Pressable style={styles.modalOverlay} onPress={hideModal}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            
            <View style={styles.modalButtons}>
              {modalType === 'success' && (
                <>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={() => handleModalAction('addAnother')}
                  >
                    <Text style={styles.modalButtonTextSecondary}>Agregar Otra</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={() => handleModalAction('viewDictionary')}
                  >
                    <Text style={styles.modalButtonTextPrimary}>Ver Diccionario</Text>
                  </TouchableOpacity>
                </>
              )}
              
              {modalType === 'duplicate' && (
                <>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonSecondary]}
                    onPress={() => handleModalAction('close')}
                  >
                    <Text style={styles.modalButtonTextSecondary}>OK</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.modalButtonPrimary]}
                    onPress={() => handleModalAction('viewDictionary')}
                  >
                    <Text style={styles.modalButtonTextPrimary}>Ver Diccionario</Text>
                  </TouchableOpacity>
                </>
              )}
              
              {modalType === 'error' && (
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={() => handleModalAction('close')}
                >
                  <Text style={styles.modalButtonTextPrimary}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    maxWidth: 600,
    alignSelf: 'center',
  },
  formSection: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 24,
    backgroundColor: '#ffffff',
    marginBottom: 48,
  },
  formHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  formIcon: {
    fontSize: 24,
    marginRight: 12,
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
  },
  formFields: {
    gap: 20,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: 16,
  },
  fieldContainer: {
    marginBottom: 4,
  },
  halfField: {
    flex: 1,
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
    color: '#1f2937',
  },
  textArea: {
    minHeight: 80,
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
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#1f2937',
  },
  modalButtonSecondary: {
    backgroundColor: '#e5e7eb',
  },
  modalButtonTextPrimary: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
  },
});