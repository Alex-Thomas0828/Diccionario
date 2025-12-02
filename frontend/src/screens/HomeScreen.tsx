import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { DictionaryAPI } from '../services/api';
import { Word } from '../models/word';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryResults, setCategoryResults] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultTitle, setResultTitle] = useState('');
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<{[key: string]: number}>({});

  // Fetch all words on component mount to calculate counts
  useEffect(() => {
    fetchAllWordsAndCounts();
  }, []);

  const fetchAllWordsAndCounts = async () => {
    try {
      const words = await DictionaryAPI.getAllWords(1, 1000); // Get all words
      setAllWords(words);
      
      // Calculate counts for each category
      const counts: {[key: string]: number} = {};
      
      words.forEach(word => {
        // Count semantic categories
        if (word.semantica) {
          const semanticKey = word.semantica.toLowerCase();
          counts[semanticKey] = (counts[semanticKey] || 0) + 1;
        }
        
        // Count grammatical categories
        if (word.categoria_grammatica) {
          const grammaticaKey = word.categoria_grammatica.toLowerCase();
          counts[grammaticaKey] = (counts[grammaticaKey] || 0) + 1;
        }
      });
      
      setCategoryCounts(counts);
      console.log('📊 Category counts:', counts);
    } catch (err) {
      console.error('Error fetching words:', err);
    }
  };

  const categoriasSemanticas = [
    { name: 'Familia', value: 'familia', description: 'Palabras relacionadas con la familia', count: categoryCounts['familia'] || 0 },
    { name: 'Naturaleza', value: 'naturaleza', description: 'Elementos de la naturaleza', count: categoryCounts['naturaleza'] || 0 },
    { name: 'Comida', value: 'comida', description: 'Alimentos y bebidas', count: categoryCounts['comida'] || 0 },
  ];

  const categoriasGramaticales = [
    { name: 'Sustantivos', value: 'sustantivo', description: 'Palabras que nombran', count: categoryCounts['sustantivo'] || 0 },
    { name: 'Verbos', value: 'verbo', description: 'Palabras de acción', count: categoryCounts['verbo'] || 0 },
    { name: 'Adjetivos', value: 'adjetivo', description: 'Palabras que describen', count: categoryCounts['adjetivo'] || 0 },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSelectedCategory(null);
    try {
      const results = await DictionaryAPI.searchWords(searchQuery);
      setSearchResults(results);
      setResultTitle(`Resultados de búsqueda: "${searchQuery}"`);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (categoryValue: string, categoryName: string, type: 'semantica' | 'gramatica') => {
    setLoading(true);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedCategory(categoryValue);
    
    try {
      // Filter from already loaded words instead of fetching again
      const filtered = allWords.filter(word => {
        if (type === 'semantica') {
          return word.semantica?.toLowerCase() === categoryValue.toLowerCase();
        } else {
          return word.categoria_grammatica?.toLowerCase() === categoryValue.toLowerCase();
        }
      });
      
      setCategoryResults(filtered);
      setResultTitle(`Palabras en: ${categoryName}`);
    } catch (err) {
      console.error('Category filter error:', err);
      setCategoryResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName);
  };

  const displayResults = searchResults.length > 0 ? searchResults : categoryResults;
  const showResults = displayResults.length > 0 || loading;

  const CategoryCard = ({ title, subtitle, items, icon, type }: any) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryIcon}>{icon}</Text>
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Text style={styles.categorySubtitle}>{subtitle}</Text>
        </View>
      </View>
      
      {items.map((item: any, index: number) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.categoryItem,
            selectedCategory === item.value && styles.categoryItemActive
          ]}
          onPress={() => handleCategoryClick(item.value, item.name, type)}
        >
          <View style={styles.categoryItemContent}>
            <Text style={[
              styles.categoryItemName,
              selectedCategory === item.value && styles.activeText
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.categoryItemDescription,
              selectedCategory === item.value && styles.activeText
            ]}>
              {item.description}
            </Text>
          </View>
          <Text style={[
            styles.categoryItemCount,
            selectedCategory === item.value && styles.activeText
          ]}>
            {item.count}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const WordResultCard = ({ word }: { word: Word }) => (
    <View style={styles.wordCard}>
      <View style={styles.wordHeader}>
        <Text style={styles.wordTitle}>{word.palabra}</Text>
        <Text style={styles.wordDefinition}>{word.definicion}</Text>
      </View>
      
      {word.ejemplo && (
        <View style={styles.wordExample}>
          <Text style={styles.exampleLabel}>Ejemplo:</Text>
          <Text style={styles.exampleText}>{word.ejemplo}</Text>
        </View>
      )}
      
      <View style={styles.wordTags}>
        {word.semantica && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{word.semantica}</Text>
          </View>
        )}
        {word.categoria_grammatica && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{word.categoria_grammatica}</Text>
          </View>
        )}
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
            style={[styles.headerButton, styles.activeButton]} 
            onPress={() => handleNavigation('Home')}
          >
            <Text style={styles.headerButtonText}>🏠 Inicio</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerButton}
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
        {/* Hero Section */}
        <Text style={styles.mainTitle}>Aprende Lengua Ancestral</Text>
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
            type="semantica"
          />
          
          <CategoryCard
            title="Categorías Gramaticales"
            subtitle="Explora palabras por función gramatical"
            icon="🏷️"
            items={categoriasGramaticales}
            type="gramatica"
          />
        </View>

        {/* Results Section */}
        {showResults && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>{resultTitle}</Text>
            <Text style={styles.resultsCount}>
              {loading ? 'Cargando...' : `${displayResults.length} palabra(s) encontrada(s)`}
            </Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1f2937" />
              </View>
            ) : displayResults.length === 0 ? (
              <View style={styles.emptyResults}>
                <Text style={styles.emptyText}>No se encontraron palabras</Text>
              </View>
            ) : (
              <View style={styles.resultsGrid}>
                {displayResults.map((word) => (
                  <WordResultCard key={word.id} word={word} />
                ))}
              </View>
            )}
          </View>
        )}
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
    marginBottom: 48,
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
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    borderRadius: 6,
  },
  categoryItemActive: {
    backgroundColor: '#1f2937',
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
  activeText: {
    color: '#ffffff',
  },
  resultsSection: {
    marginBottom: 48,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyResults: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  resultsGrid: {
    gap: 16,
  },
  wordCard: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#ffffff',
    borderLeftWidth: 4,
    borderLeftColor: '#1f2937',
  },
  wordHeader: {
    marginBottom: 12,
  },
  wordTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  wordDefinition: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  wordExample: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    color: '#374151',
    fontStyle: 'italic',
  },
  wordTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});