import { Router } from 'express';
import * as wordController from '../controllers/words.controller';

/**
 * Router para manejar todas las rutas relacionadas con palabras del diccionario
 * 
 * @description
 * Este router centraliza:
 * - Rutas públicas de consulta
 * - Rutas para modificación de palabras
 * Todas las rutas delegan la lógica a los controladores correspondientes
 */
const router = Router();

/* ======================
   RUTAS PÚBLICAS (LECTURA)
   ====================== */

/**
 * Obtener todas las palabras (con paginación)
 * @route GET /words
 * @returns {Word[]} Lista de palabras paginada
 */
router.get('/', wordController.getAllWords);

/**
 * Buscar palabras por término
 * @route GET /words/search
 * @param {string} q - Término de búsqueda
 * @returns {Word[]} Palabras que coinciden con el término
 */
router.get('/search', wordController.searchWords);

/**
 * Obtener una palabra específica por ID
 * @route GET /words/:id
 * @param {number} id - ID de la palabra
 * @returns {Word} La palabra encontrada
 */
router.get('/:id', wordController.getWord);

/* =============================
   RUTAS DE MODIFICACIÓN (CRUD)
   ============================= */

/**
 * Crear una nueva palabra
 * @route POST /words
 * @body {string} word - La palabra a crear
 * @body {string} definition - Su definición
 * @returns {Word} La palabra creada
 */
router.post('/', wordController.createWord);

/**
 * Actualizar una palabra existente
 * @route PUT /words/:id
 * @param {number} id - ID de la palabra a actualizar
 * @body {string} [word] - Nuevo texto de la palabra (opcional)
 * @body {string} [definition] - Nueva definición (opcional)
 * @returns {success: boolean} Confirmación de la operación
 */
router.put('/:id', wordController.updateWord);

/**
 * Eliminar una palabra
 * @route DELETE /words/:id
 * @param {number} id - ID de la palabra a eliminar
 * @returns {success: boolean} Confirmación de la operación
 */
router.delete('/:id', wordController.deleteWord);

export default router;