import { Word } from 'frontend/src/models/word.ts'; 

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || process.env.API_BASE_URL || 'http://localhost:3001/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Request failed');
  }
  return response.json();
};

export const DictionaryAPI = {
  getAllWords: async (page = 1, limit = 10): Promise<Word[]> => {
    const response = await fetch(`${API_BASE_URL}/words?page=${page}&limit=${limit}`);
    return handleResponse(response);
  },

  searchWords: async (term: string): Promise<Word[]> => {
  const response = await fetch(`${API_BASE_URL}/words/search?q=${encodeURIComponent(term)}`);
  if (!response.ok) throw new Error('Search failed');
  return await response.json();
},

  createWord: async (wordData: { word: string; definition: string }): Promise<Word> => {
    const response = await fetch(`${API_BASE_URL}/words`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordData)
    });
    if (!response.ok) throw new Error('Failed to create word');
    return await response.json();
  },

  updateWord: async (id: number, wordData: Partial<Word>): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordData)
    });
    if (!response.ok) throw new Error('Failed to update word');
    return true;
  },

deleteWord: async (id: number): Promise<boolean> => {
  console.log('DELETE Request to:', `${API_BASE_URL}/words/${id}`); // Debug A
  const response = await fetch(`${API_BASE_URL}/words/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('DELETE Response Status:', response.status); // Debug B
  if (!response.ok) throw new Error('Error al eliminar');
  return true;
}
};