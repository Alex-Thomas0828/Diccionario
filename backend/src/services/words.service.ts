import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../db';
import { Word, WordRow } from '../models/word';

/**
 * Servicio para manejar operaciones CRUD de palabras en la base de datos
 * 
 * @description
 * Este módulo contiene todas las operaciones de base de datos relacionadas
 * con las palabras del diccionario, usando MySQL como motor de base de datos.
 */

/**
 * Obtiene todas las palabras del diccionario
 * @returns {Promise<Word[]>} Lista de palabras
 * @throws {Error} Si hay un error en la consulta
 */
export const getAllWords = async (): Promise<Word[]> => {
  const [rows] = await pool.query<WordRow[]>('SELECT * FROM words');
  return rows;
};

/**
 * Busca palabras que coincidan con un término
 * @param {string} term - Término de búsqueda
 * @returns {Promise<Word[]>} Lista de palabras que coinciden
 * @throws {Error} Si hay un error en la consulta
 */
export const searchWords = async (term: string): Promise<Word[]> => {
  const [rows] = await pool.query<WordRow[]>(
    'SELECT * FROM words WHERE word LIKE ?',
    [`%${term}%`]  // El % permite búsqueda parcial
  );
  return rows;
};

/**
 * Obtiene una palabra específica por su ID
 * @param {number} id - ID de la palabra
 * @returns {Promise<Word | null>} La palabra encontrada o null
 * @throws {Error} Si hay un error en la consulta
 */
export const getWordById = async (id: number): Promise<Word | null> => {
  const [rows] = await pool.query<WordRow[]>(
    'SELECT * FROM words WHERE id = ?', 
    [id]
  );
  return rows[0] || null;  // Devuelve null si no encuentra la palabra
};

/**
 * Crea una nueva palabra en el diccionario
 * @param {Object} wordData - Datos de la palabra
 * @param {string} wordData.word - La palabra a crear
 * @param {string} wordData.definition - Definición de la palabra
 * @returns {Promise<Word>} La palabra creada con su ID
 * @throws {Error} Si hay un error en la inserción
 */
export const createWord = async (wordData: { word: string; definition: string }): Promise<Word> => {
  // 1. Insertar la nueva palabra
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO words (word, definition) VALUES (?, ?)',
    [wordData.word, wordData.definition]
  );
  
  // 2. Obtener la palabra recién creada (con timestamps automáticos)
  const [rows] = await pool.query<WordRow[]>(
    'SELECT * FROM words WHERE id = ?',
    [result.insertId]  // ID generado por la base de datos
  );
  
  return rows[0]; // Retorna la palabra con todos sus datos
};

/**
 * Actualiza una palabra existente
 * @param {number} id - ID de la palabra a actualizar
 * @param {Partial<Word>} wordData - Campos a actualizar
 * @returns {Promise<boolean>} True si se actualizó, false si no existía
 * @throws {Error} Si hay un error en la actualización
 */
export const updateWord = async (
  id: number, 
  wordData: Partial<Word>
): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    'UPDATE words SET ? WHERE id = ?',
    [wordData, id]
  );
  // affectedRows indica cuántas filas se modificaron
  return result.affectedRows > 0;
};

/**
 * Elimina una palabra del diccionario
 * @param {number} id - ID de la palabra a eliminar
 * @returns {Promise<boolean>} True si se eliminó, false si no existía
 * @throws {Error} Si hay un error al eliminar
 */
export const deleteWord = async (id: number): Promise<boolean> => {
  const [result] = await pool.query<ResultSetHeader>(
    'DELETE FROM words WHERE id = ?',
    [id]
  );
  // affectedRows indica cuántas filas se eliminaron
  return result.affectedRows > 0;
};