/**
 * Módulo para interactuar con la API del Diccionario
 * @namespace DictionaryAPI
 * @description Contiene métodos para todas las operaciones CRUD de palabras
 */

import { Word } from 'frontend/src/models/word.ts'; 

/**
 * URL base de la API
 * @constant {string}
 * @default 'http://localhost:3001/api'
 * @description 
 * Orden de prioridad:
 * 1. EXPO_PUBLIC_API_URL (variable de entorno para Expo)
 * 2. API_BASE_URL (variable de entorno genérica)
 * 3. URL local por defecto
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || process.env.API_BASE_URL || 'http://localhost:3001/api';

/**
 * Maneja la respuesta del servidor
 * @async
 * @function
 * @param {Response} response - Objeto Response de fetch
 * @returns {Promise<any>} Datos parseados de la respuesta
 * @throws {Error} Cuando la respuesta no es exitosa (status no 2xx)
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Request failed');
  }
  return response.json();
};

export const DictionaryAPI = {
  /**
   * Obtiene palabras paginadas
   * @async
   * @function
   * @param {number} [page=1] - Número de página
   * @param {number} [limit=10] - Cantidad de resultados por página
   * @returns {Promise<Word[]>} Lista de palabras
   * @example
   * const words = await DictionaryAPI.getAllWords(1, 20);
   */
  getAllWords: async (page = 1, limit = 10): Promise<Word[]> => {
    const response = await fetch(`${API_BASE_URL}/words?page=${page}&limit=${limit}`);
    return handleResponse(response);
  },

  /**
   * Busca palabras por término
   * @async
   * @function
   * @param {string} term - Término de búsqueda
   * @returns {Promise<Word[]>} Lista de palabras coincidentes
   * @example
   * const results = await DictionaryAPI.searchWords("ejemplo");
   */
  searchWords: async (term: string): Promise<Word[]> => {
    const response = await fetch(`${API_BASE_URL}/words/search?q=${encodeURIComponent(term)}`);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  },

  /**
   * Crea una nueva palabra
   * @async
   * @function
   * @param {Object} wordData - Datos de la palabra
   * @param {string} wordData.word - Palabra a crear
   * @param {string} wordData.definition - Definición de la palabra
   * @returns {Promise<Word>} Palabra creada con ID
   * @example
   * const newWord = await DictionaryAPI.createWord({
   *   word: "nuevo",
   *   definition: "definición"
   * });
   */
  createWord: async (wordData: { word: string; definition: string }): Promise<Word> => {
    const response = await fetch(`${API_BASE_URL}/words`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordData)
    });
    if (!response.ok) throw new Error('Failed to create word');
    return await response.json();
  },

  /**
   * Actualiza una palabra existente
   * @async
   * @function
   * @param {number} id - ID de la palabra a actualizar
   * @param {Partial<Word>} wordData - Campos a actualizar
   * @returns {Promise<boolean>} True si la actualización fue exitosa
   * @example
   * const success = await DictionaryAPI.updateWord(1, {
   *   definition: "nueva definición"
   * });
   */
  updateWord: async (id: number, wordData: Partial<Word>): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wordData)
    });
    if (!response.ok) throw new Error('Failed to update word');
    return true;
  },

  /**
   * Elimina una palabra
   * @async
   * @function
   * @param {number} id - ID de la palabra a eliminar
   * @returns {Promise<boolean>} True si la eliminación fue exitosa
   * @example
   * const deleted = await DictionaryAPI.deleteWord(1);
   */
  deleteWord: async (id: number): Promise<boolean> => {
    console.log('DELETE Request to:', `${API_BASE_URL}/words/${id}`); 
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('DELETE Response Status:', response.status); 
    if (!response.ok) throw new Error('Error al eliminar');
    return true;
  }
};