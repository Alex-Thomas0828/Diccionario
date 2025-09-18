import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Searchbar, List, FAB, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DictionaryAPI } from '../services/api';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Word } from '../models/word';

type Props = NativeStackNavigationProp<RootStackParamList, 'Dictionary'> & {
  route: {
    params?: {
      searchTerm?: string;
    };
  };
};

/**
 * Pantalla principal del diccionario que muestra una lista de palabras
 * y permite buscar, añadir y navegar a la edición de palabras.
 */
export default function DictionaryScreen({ route }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Dictionary'>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Función para cargar palabras, con memoización para optimización
   * @param {boolean} reset - Indica si debe reiniciar la paginación
   */
  const loadWords = useCallback(async (reset = false) => {
    try {
      setError(null);
      const currentPage = reset ? 1 : page;
      
      let data: Word[];
      if (searchQuery.trim()) {
        // Modo búsqueda: carga resultados de búsqueda sin paginación
        data = await DictionaryAPI.searchWords(searchQuery);
        setHasMore(false);
      } else {
        // Modo normal: carga palabras paginadas
        data = await DictionaryAPI.getAllWords(currentPage);
        setHasMore(data.length > 0);
      }

      setWords(prev => reset ? data : [...prev, ...data]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error: No se pudieron cargar las palabras';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, searchQuery]);

useEffect(() => {
    if (route.params?.searchTerm) {
      setSearchQuery(route.params.searchTerm);
      setIsSearching(true);
    }
  }, [route.params?.searchTerm]);

  /**
   * Efecto para carga inicial y búsquedas con debounce
   */
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadWords(true);
      setPage(1); // Reinicia a la primera página en cada búsqueda
    }, 500); // Debounce de 500ms para búsquedas

    return () => clearTimeout(timer);
  }, [searchQuery, loadWords]);

  /**
   * Maneja el evento de "pull to refresh"
   */
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadWords(true);
  }, [loadWords]);

  /**
   * Maneja la carga de más elementos al hacer scroll
   */
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && !searchQuery.trim()) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore, searchQuery]);

  // Estado de carga inicial
  if (loading && !refreshing && words.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  // Estado de error
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button
          mode="contained"
          onPress={() => {
            setLoading(true);
            loadWords(true);
          }}
          style={styles.retryButton}
        >
          Reintentar
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <Searchbar
        placeholder="Buscar en el diccionario"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
        loading={isSearching}
      />
      
      {/* Lista de palabras */}
      <FlatList
        data={words}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
  <List.Item
    title={item.word}
    description={`
      ${item.categoria_gramatical} • ${item.semantica}
      \nDefinición: ${item.definition}
      ${item.ejemplo ? `\nEjemplo: "${item.ejemplo}"` : ''}
    `}
    titleStyle={styles.wordTitle}
    onPress={() => navigation.navigate('WordEditor', { word: item })}
    right={props => <List.Icon {...props} icon="pencil" />}
    descriptionNumberOfLines={10} // Increase to show more lines
  />
)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          hasMore && !searchQuery.trim() ? (
            <View style={styles.loadingFooter}>
              <ActivityIndicator animating={true} />
            </View>
          ) : null
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text>No se encontraron palabras</Text>
            {searchQuery.trim() && (
              <Button 
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
              >
                Limpiar búsqueda
              </Button>
            )}
          </View>
        }
      />

      {/* Botón flotante para añadir nuevas palabras */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('WordEditor', {})}
      />
    </View>
  );
}

/**
 * Estilos para la pantalla del diccionario
 */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200
  },
  search: { 
    marginBottom: 16 
  },
  wordTitle: { 
    fontWeight: 'bold' 
  },
  fab: { 
    position: 'absolute', 
    margin: 16, 
    right: 0, 
    bottom: 0 
  },
  errorText: { 
    color: 'red', 
    marginBottom: 16,
    textAlign: 'center'
  },
  retryButton: {
    marginTop: 8
  },
  loadingFooter: {
    paddingVertical: 20
  },
  clearSearchButton: {
    marginTop: 16
  }
});