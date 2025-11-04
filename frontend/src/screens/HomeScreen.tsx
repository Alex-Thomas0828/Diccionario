import { useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const categoriasSemanticas = [
    { name: 'Familia', description: 'Palabras relacionadas con la familia', count: 1 },
    { name: 'Naturaleza', description: 'Elementos de la naturaleza', count: 1 },
    { name: 'Comida', description: 'Alimentos y bebidas', count: 1 },
  ];

  const categoriasGramaticales = [
    { name: 'Sustantivos', description: 'Palabras que nombran', count: 2 },
    { name: 'Verbos', description: 'Palabras de acción', count: 1 },
    { name: 'Adjetivos', description: 'Palabras que describen', count: 0 },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Dictionary', { searchTerm: searchQuery });
    }
  };

  const CategoryCard = ({ title, subtitle, items, icon }: any) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryIcon}>{icon}</Text>
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Text style={styles.categorySubtitle}>{subtitle}</Text>
        </View>
      </View>
      
      {items.map((item: any, index: number) => (
        <TouchableOpacity key={index} style={styles.categoryItem}>
          <View style={styles.categoryItemContent}>
            <Text style={styles.categoryItemName}>{item.name}</Text>
            <Text style={styles.categoryItemDescription}>{item.description}</Text>
          </View>
          <Text style={styles.categoryItemCount}>{item.count}</Text>
        </TouchableOpacity>
      ))}
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
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>🏠 Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>👤 Contribuir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonText}>⚙️ Administración</Text>
          </TouchableOpacity>
          <Text style={styles.adminText}>admin Administrador</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Hero Section */}
        <Text style={styles.mainTitle}>¡Aprende Lengua Ancestral!</Text>
        <Text style={styles.subtitle}>
          Explora y aprende palabras de nuestra lengua ancestral. Busca palabras 
          específicas o navega por categorías para descubrir nuevo vocabulario.
        </Text>

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>🔍 Buscar Palabras</Text>
          <Text style={styles.searchSubtitle}>
            Ingresa una palabra en la lengua ancestral o su significado en español
          </Text>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Ej: atl, agua, madre..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>🔍 Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.categoriesContainer}>
          <CategoryCard
            title="Categorías Semánticas"
            subtitle="Explora palabras por tema o contexto"
            icon="📚"
            items={categoriasSemanticas}
          />
          
          <CategoryCard
            title="Categorías Gramaticales"
            subtitle="Explora palabras por función gramatical"
            icon="🏷️"
            items={categoriasGramaticales}
          />
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
  searchSection: {
    marginBottom: 48,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  searchSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  searchButton: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  categoriesContainer: {
    gap: 24,
  },
  categoryCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryItemContent: {
    flex: 1,
  },
  categoryItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  categoryItemDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryItemCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 16,
  },
});