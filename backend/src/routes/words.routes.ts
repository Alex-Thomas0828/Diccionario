import { Router, Request, Response } from 'express';
import { supabase } from '../../supabaseClient';


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
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // ⚙️ Example: add pagination params (optional)
    const { page = 1, limit = 20 } = req.query as { page?: number; limit?: number };
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await supabase
      .from('dictionary')
      .select('*')
      .range(from, to);

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Error fetching words:', err);
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

/**
 * Buscar palabras por término
 * @route GET /words/search
 * @param {string} q - Término de búsqueda
 * @returns {Word[]} Palabras que coinciden con el término
 */
router.get('/search', async(req: Request, res: Response):Promise<void> => {
  try {
      const term = req.query.q as string;

      // Validar que exista un término de búsqueda
      if (!term) {
         res.status(400).json({ error: 'Search term required' });
         return;
      }

      // Consultar en Supabase con búsqueda parcial (ILIKE = case-insensitive LIKE)
      const { data, error } = await supabase
      .from('dictionary')
      .select('*')
      .ilike('palabra', `%${term}%`);

      if (error) throw error;

      // Devolver resultados
      res.status(200).json(data);
  } catch (err) {
      console.error('Search error:', err);
      res.status(500).json({ error: 'Search failed' });
  }
});

/**
 * Obtener una palabra específica por ID
 * @route GET /words/:id
 * @param {number} id - ID de la palabra
 * @returns {Word} La palabra encontrada
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
   try{
      const { id } = req.params;

      const {data, error } = await supabase
      .from('dictionary')
      .select('*')
      .eq('id', id)
      .single();
      

      if (error) throw error;
      res.json
      res.status(200).json(data);
   } catch (err) {
      console.log("failed to fetch word: ", err )
      res.status(500).json({ error: 'Failed to fetch words' });
   }
});

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
router.post('/', async (req: Request, res: Response):Promise<void> => {
   const {palabra, definicion, semantica, categoria_grammatica, ejemplo} = req.body;
   
   console.log('🔵 POST /words - Received data:', { palabra, definicion, semantica, categoria_grammatica });
   
   // 🧩 Validación de campos obligatorios
   if (!palabra || !definicion || !semantica || !categoria_grammatica) {
      console.log('❌ Validation failed: missing required fields');
      res.status(400).json({ error: 'Todos los campos obligatorios son requeridos' });
      return;
   }

   try{
      // First check if word already exists
      console.log('🔍 Checking if word exists:', palabra.trim());
      const { data: existingWord } = await supabase
         .from('dictionary')
         .select('id, palabra')
         .eq('palabra', palabra.trim())
         .maybeSingle();

      console.log('🔍 Existing word result:', existingWord);

      if (existingWord) {
         console.log('⚠️ Duplicate detected! Returning 409');
         res.status(409).json({ 
            error: 'Esta palabra ya existe en el diccionario',
            code: 'DUPLICATE_WORD'
         });
         return;
      }

      // If word doesn't exist, insert it
      console.log('✅ Word is unique, inserting...');
      const {data, error} = await supabase
      .from('dictionary')
      .insert([{
         palabra: palabra.trim(),
         definicion: definicion.trim(),
         semantica: semantica || null,
         categoria_grammatica: categoria_grammatica || null,
         ejemplo: ejemplo ? ejemplo.trim() : null
      }])
      .select()
      .single();

      if (error) {
         console.log('❌ Supabase error:', error);
         // Handle Supabase unique constraint error
         if (error.code === '23505') {
            res.status(409).json({ 
               error: 'Esta palabra ya existe en el diccionario',
               code: 'DUPLICATE_WORD'
            });
            return;
         }
         throw error;
      }
      
      console.log('✅ Word created successfully:', data);
      res.status(201).json(data);
   } catch (err) {
      console.error('❌ Catch block error:', err);
      res.status(500).json({ error: 'No se pudo agregar la palabra' });
   }

});

/**
 * Actualizar una palabra existente
 * @route PUT /words/:id
 * @param {number} id - ID de la palabra a actualizar
 * @body {string} [word] - Nuevo texto de la palabra (opcional)
 * @body {string} [definition] - Nueva definición (opcional)
 * @returns {success: boolean} Confirmación de la operación
 */
router.put('/:id', async (req: Request, res: Response) => {
   const id = parseInt(req.params.id);
   const { word, definition, semantica, categoria_grammatica, ejemplo } = req.body;

   try{
      const {data, error} = await supabase
      .from('dictionary')
      .update({
         word, 
         definition,
         semantica, 
         categoria_grammatica,
         ejemplo
      })
      .eq('id',id)
      .select();

      

      // ❌ Si no se encontró registro
      if (!data || data.length === 0) {
         res.status(404).json({ error: 'Word not found' });
      return;
      }

      // ✅ Si todo fue bien
      res.json({ success: true });

      if (error) throw error;
   } catch(err) {
      console.log('could not update word: ', err);
      res.status(500).json({ error: 'Failed to update word' });
   }
});

/**
 * Eliminar una palabra
 * @route DELETE /words/:id
 * @param {number} id - ID de la palabra a eliminar
 * @returns {success: boolean} Confirmación de la operación
 */
router.delete('/:id', async (req: Request, res: Response) => {
   const id = parseInt(req.params.id);

   try{
      const {data, error} = await supabase
      .from('dictionary')
      .delete()
      .eq('id', id)
      .select();

      if (error) throw error;

      res.json({ success: true });
   } catch (err) {
      console.log('could not delete word: ', err);
      res.status(500).json({ error: 'Failed to delete word' });
   }
});

export default router;