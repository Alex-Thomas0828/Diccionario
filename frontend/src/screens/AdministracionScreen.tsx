import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';

export default function AdministracionScreen() {
  const [activeTab, setActiveTab] = useState('pendientes'); // 'pendientes' | 'aprobadas' | 'rechazadas'

  // Example data with categories
  const palabrasPendientes = [
    { palabra: 'tlalli', significado: 'tierra', categoria: 'sustantivo' },
    { palabra: 'calli', significado: 'casa', categoria: 'sustantivo' },
  ];
  const palabrasAprobadas = [
    { palabra: 'atl', significado: 'agua', categoria: 'sustantivo' },
    { palabra: 'cihuatl', significado: 'mujer', categoria: 'sustantivo' },
  ];
  const palabrasRechazadas = [
    { palabra: 'xochitl', significado: 'flor', categoria: 'sustantivo' },
  ];

  const totalPalabras =
    palabrasPendientes.length +
    palabrasAprobadas.length +
    palabrasRechazadas.length;

  const getDataForTab = () => {
    if (activeTab === 'pendientes') return palabrasPendientes;
    if (activeTab === 'aprobadas') return palabrasAprobadas;
    return palabrasRechazadas;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Add button on the right */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Panel de Administración</Text>
        <TouchableOpacity style={styles.addWordButton} onPress={() => { /* TODO: open add modal */ }}>
          <Text style={styles.addWordText}>+ Agregar Palabra</Text>
        </TouchableOpacity>
      </View>

      {/* Counters */}
      <View style={styles.counters}>
        <View style={styles.counterCard}>
          <Text style={styles.counterNumber}>{totalPalabras}</Text>
          <Text style={styles.counterLabel}>Total Palabras</Text>
        </View>
        <View style={styles.counterCard}>
          <Text style={styles.counterNumber}>{palabrasPendientes.length}</Text>
          <Text style={styles.counterLabel}>Pendientes</Text>
        </View>
        <View style={styles.counterCard}>
          <Text style={styles.counterNumber}>{palabrasAprobadas.length}</Text>
          <Text style={styles.counterLabel}>Aprobadas</Text>
        </View>
        <View style={styles.counterCard}>
          <Text style={styles.counterNumber}>{palabrasRechazadas.length}</Text>
          <Text style={styles.counterLabel}>Rechazadas</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'pendientes' && styles.activeTab]}
          onPress={() => setActiveTab('pendientes')}
        >
          <Text style={[styles.tabText, activeTab === 'pendientes' && styles.activeTabText]}>Pendientes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'aprobadas' && styles.activeTab]}
          onPress={() => setActiveTab('aprobadas')}
        >
          <Text style={[styles.tabText, activeTab === 'aprobadas' && styles.activeTabText]}>Aprobadas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'rechazadas' && styles.activeTab]}
          onPress={() => setActiveTab('rechazadas')}
        >
          <Text style={[styles.tabText, activeTab === 'rechazadas' && styles.activeTabText]}>Rechazadas</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <View style={styles.section}>
        {getDataForTab().map((item, index) => (
          <View key={`${item.palabra}-${index}`} style={styles.cardRow}>
            {/* Word + meaning */}
            <View style={styles.wordBlock}>
              <Text style={styles.wordText}>{item.palabra}</Text>
              <Text style={styles.meaningText}>{item.significado}</Text>

              {/* Category tags (chips) */}
              <View style={styles.categoryRow}>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{item.categoria}</Text>
                </View>
                {/* Example of multiple categories: add more tags if your data has them */}
                {/* <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>verbo</Text>
                </View> */}
              </View>
            </View>

            {/* Buttons under word */}
            <View style={styles.buttonRow}>
              {activeTab === 'pendientes' && (
                <>
                  <TouchableOpacity style={[styles.actionButton, styles.approveButton]}>
                    <Text style={styles.actionButtonText}>Aprobar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.rejectButton]}>
                    <Text style={styles.actionButtonText}>Rechazar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                    <Text style={styles.editDeleteText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                    <Text style={styles.editDeleteText}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              )}

              {activeTab === 'aprobadas' && (
                <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                  <Text style={styles.editDeleteText}>Editar</Text>
                </TouchableOpacity>
              )}

              {activeTab === 'rechazadas' && (
                <>
                  <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                    <Text style={styles.editDeleteText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                    <Text style={styles.editDeleteText}>Eliminar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1f2937' },

  addWordButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addWordText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  counters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  counterCard: {
    flex: 1,
    minWidth: 150,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 12,
    marginRight: 12,
  },
  counterNumber: { fontSize: 24, fontWeight: '700', color: '#1f2937', marginBottom: 4 },
  counterLabel: { fontSize: 14, color: '#6b7280', fontWeight: '500' },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  tabButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 6,
  },
  activeTab: { backgroundColor: '#1f2937', borderColor: '#1f2937' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  activeTabText: { color: '#ffffff' },

  section: { paddingHorizontal: 24, paddingVertical: 12 },

  cardRow: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  wordBlock: { marginBottom: 12 },
  wordText: { fontSize: 16, fontWeight: '700', color: '#374151' },
  meaningText: { fontSize: 14, color: '#6b7280', marginTop: 2 },

  // Category tags row
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryTag: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,       // pill shape
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#ffffff',
  },
  categoryText: {
    fontSize: 12,            // smaller text
    color: '#374151',
    fontWeight: '500',
  },

  // Buttons under word
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap' },

  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  approveButton: { backgroundColor: '#22c55e' }, // green
  rejectButton: { backgroundColor: '#dc2626' },  // red
  editButton: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#000000' },
  deleteButton: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#000000' },

  actionButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  editDeleteText: { color: '#000000', fontSize: 14, fontWeight: '600' },
});
