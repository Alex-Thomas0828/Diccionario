import { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, List, FAB } from 'react-native-paper';
import { SectionList } from 'react-native';

export default function DictionaryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [words, setWords] = useState([
    { id: '1', term: 'Apple', definition: 'A fruit that grows on trees' },
    { id: '2', term: 'Banana', definition: 'Yellow curved tropical fruit' },
  ]);

  const filteredWords = words.filter(word => 
    word.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search dictionary"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />
      
      <FlatList
        data={filteredWords}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.term}
            description={item.definition}
            titleStyle={styles.wordTitle}
          />
        )}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Add new word')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  search: { marginBottom: 16 },
  wordTitle: { fontWeight: 'bold' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});