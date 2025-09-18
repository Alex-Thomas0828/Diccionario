/**
 * Módulo de API para interactuar con el backend del diccionario
 * @namespace DictionaryAPI
 * @description Proporciona métodos para todas las operaciones CRUD de palabras
 */

import { Word } from '../models/word';

/**
 * URL base de la API
 * @constant {string}
 * @default 'http://localhost:3001/api'
 * @description Orden de prioridad para la URL:
 * 1. EXPO_PUBLIC_API_URL (variable de entorno para Expo)
 * 2. URL local por defecto
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

export const DictionaryAPI = {
  /**
   * Obtiene todas las palabras del diccionario
   * @async
   * @function
   * @returns {Promise<Word[]>} Lista de palabras
   * @throws {Error} Si falla la petición
   * @example
   * const words = await DictionaryAPI.getAllWords();
   */
  getAllWords: async (): Promise<Word[]> => {
    const response = await fetch(`${API_BASE_URL}/words`);
    if (!response.ok) throw new Error('No se pudieron obtener palabras');
    return await response.json();
  },

  /**
   * Busca palabras por término
   * @async
   * @function
   * @param {string} term - Término de búsqueda
   * @returns {Promise<Word[]>} Lista de palabras coincidentes
   * @throws {Error} Si falla la búsqueda
   * @example
   * const results = await DictionaryAPI.searchWords("ejemplo");
   */
  searchWords: async (term: string): Promise<Word[]> => {
    const response = await fetch(`${API_BASE_URL}/words/search?term=${encodeURIComponent(term)}`);
    if (!response.ok) throw new Error('Error en la búsqueda');
    return await response.json();
  },

  /**
   * Crea una nueva palabra
   * @async
   * @function
   * @param {Object} wordData - Datos de la palabra
   * @param {string} wordData.word - Palabra a crear
   * @param {string} wordData.definition - Definición de la palabra
   * @returns {Promise<Word>} Palabra creada con su ID
   * @throws {Error} Si falla la creación
   * @example
   * const newWord = await DictionaryAPI.createWord({
   *   word: "nuevo",
   *   definition: "definición"
   * });
   */
  createWord: async (wordData: { 
  word: string; 
  definition: string;
  semantica: string;
  categoria_gramatical: string;
  ejemplo: string;
}): Promise<Word> => {
  const response = await fetch(`${API_BASE_URL}/words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wordData)
  });
    if (!response.ok) throw new Error('No se pudo crear Word');
    return await response.json();
  },

  /**
   * Actualiza una palabra existente
   * @async
   * @function
   * @param {number} id - ID de la palabra a actualizar
   * @param {Partial<Word>} wordData - Campos a actualizar
   * @returns {Promise<boolean>} True si la actualización fue exitosa
   * @throws {Error} Si falla la actualización
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
    if (!response.ok) throw new Error('No se pudo actualizar Word');
    return true;
  },

  /**
   * Elimina una palabra
   * @async
   * @function
   * @param {number} id - ID de la palabra a eliminar
   * @returns {Promise<boolean>} True si la eliminación fue exitosa
   * @throws {Error} Si falla la eliminación
   * @example
   * const deleted = await DictionaryAPI.deleteWord(1);
   */
  deleteWord: async (id: number): Promise<boolean> => {
    const response = await fetch(`${API_BASE_URL}/words/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('No se pudo eliminar Word');
    return true;
  }
};

/**
 * Manejador de respuestas no utilizado actualmente
 * @async
 * @function
 * @private
 * @param {Response} response - Objeto Response de fetch
 * @returns {Promise<any>} Datos de la respuesta
 * @throws {Error} Cuando la respuesta no es exitosa
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la solicitud');
  }
  return response.json();
};