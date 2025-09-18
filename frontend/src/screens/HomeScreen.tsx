import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Text, Chip, useTheme, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Home'>>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const categoriasSemanticas = ['Abstracto', 'Emociones', 'Naturaleza', 'Tecnología'];
  const categoriasGramaticales = ['Sustantivo', 'Verbo', 'Adjetivo', 'Adverbio'];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('Dictionary', { searchTerm: searchQuery });
      setSearchQuery('');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sección Hero */}
      <View style={[styles.hero, { backgroundColor: colors.primaryContainer }]}>
        <Text style={[styles.heroTitle, { color: colors.onPrimaryContainer }]}>
          Explora el Universo Semántico de las Palabras
        </Text>
        
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Dictionary', { searchTerm: searchQuery })}
          style={styles.heroButton}
          labelStyle={styles.heroButtonText}
        >
          Ver Diccionario Completo
        </Button>

        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Buscar palabra..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={colors.primary}
            theme={{ colors: { primary: colors.primary } }}
          />
          <Button 
            mode="contained" 
            onPress={handleSearch}
            style={styles.searchButton}
            labelStyle={styles.searchButtonText}
            disabled={!searchQuery.trim()}
          >
            Buscar
          </Button>
        </View>
      </View>

      {/* Sección de Categorías */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.onBackground }]}>
          Explorar por Categorías
        </Text>
        
        <Text style={[styles.subsectionTitle, { color: colors.onSurfaceVariant }]}>
          Categorías Semánticas
        </Text>
        <View style={styles.chipContainer}>
          {categoriasSemanticas.map(cat => (
            <Chip 
              key={cat} 
              style={[styles.semanticChip, { backgroundColor: colors.secondaryContainer }]}
              textStyle={{ color: colors.onSecondaryContainer }}
            >
              {cat}
            </Chip>
          ))}
        </View>

        <Text style={[styles.subsectionTitle, { color: colors.onSurfaceVariant }]}>
          Categorías Gramaticales
        </Text>
        <View style={styles.chipContainer}>
          {categoriasGramaticales.map(cat => (
            <Chip 
              key={cat} 
              style={[styles.grammaticalChip, { backgroundColor: colors.tertiaryContainer }]}
              textStyle={{ color: colors.onTertiaryContainer }}
            >
              {cat}
            </Chip>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  hero: {
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  heroButton: {
    borderRadius: 8,
    marginBottom: 16,
  },
  heroButtonText: {
    fontSize: 16,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchBar: {
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  searchInput: {
    minHeight: 40,
  },
  searchButton: {
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  semanticChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  grammaticalChip: {
    marginRight: 8,
    marginBottom: 8,
  },
});