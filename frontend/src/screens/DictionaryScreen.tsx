import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Searchbar, List, FAB, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { DictionaryAPI } from '../services/api';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { Word } from '../models/word';

export default function DictionaryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Dictionary'>>();
  const [searchQuery, setSearchQuery] = useState('');
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Memoized loadWords function
  const loadWords = useCallback(async (reset = false) => {
    try {
      setError(null);
      const currentPage = reset ? 1 : page;
      
      let data: Word[];
      if (searchQuery.trim()) {
        data = await DictionaryAPI.searchWords(searchQuery);
        setHasMore(false); // Disable pagination during search
      } else {
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

  // Initial load and reset on search query change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      loadWords(true);
      setPage(1); // Reset to first page on search
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(timer);
  }, [searchQuery, loadWords]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadWords(true);
  }, [loadWords]);

  // Load more items
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && !searchQuery.trim()) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore, searchQuery]);

  // Render loading indicator
  if (loading && !refreshing && words.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  // Render error state
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
      <Searchbar
        placeholder="Buscar en el diccionario"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
        loading={isSearching}
      />
      
      <FlatList
        data={words}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <List.Item
            title={item.word}
            description={item.definition}
            titleStyle={styles.wordTitle}
            onPress={() => navigation.navigate('WordEditor', { word: item })}
            right={props => <List.Icon {...props} icon="pencil" />}
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

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('WordEditor', {})}
      />
    </View>
  );
}

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