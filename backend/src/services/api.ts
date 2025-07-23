import { Word } from '../models/word';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

export const DictionaryAPI = {
  // Get all words
  getAllWords: async (): Promise<Word[]> => {
    const response = await fetch(`${API_BASE_URL}/words`);
    if (!response.ok) throw new Error('Failed to fetch words');
    return await response.json();
  },

  // Search words
  searchWords: async (term: string): Promise<Word[]> => {
    const response = await fetch(`${API_BASE_URL}/words/search?term=${encodeURIComponent(term)}`);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  },

  // Create word
  createWord: async (wordData: { word: string; definition: string }): Promise<Word> => {
    const response = await fetch(`${API_BASE_URL}/words`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordData)
    });
    if (!response.ok) throw new Error('Failed to create word');
    return await response.json();
  },

  // Update word
  updateWord: async (id: number, wordData: Partial<Word>): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordData)
    });
    if (!response.ok) throw new Error('Failed to update word');
    return true;
  },

  // Delete word
  deleteWord: async (id: number): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete word');
    return true;
  }
};

// Unused error handler
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};