import { Request, Response } from 'express';
import * as wordService from '../services/words.service';

// Controlador para obtener todas las palabras con paginación
export const getAllWords = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener parámetros de paginación o usar valores por defecto
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    
    // Llamar al servicio para obtener las palabras
    const words = await wordService.getAllWords();
    
    // Devolver las palabras en formato JSON
    res.json(words);
  } catch (error) {
    // Manejar errores del servidor
    res.status(500).json({ error: 'Failed to fetch words' });
  }
};

// Controlador para buscar palabras por término
export const searchWords = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener el término de búsqueda de los query params
    const term = req.query.q as string;
    
    // Validar que el término de búsqueda exista
    if (!term) {
      res.status(400).json({ error: 'Search term required' });
      return;
    }
    
    // Llamar al servicio de búsqueda
    const results = await wordService.searchWords(term);
    
    // Devolver los resultados
    res.json(results);
  } catch (error) {
    // Manejar errores de búsqueda
    res.status(500).json({ error: 'Search failed' });
  }
};

// Controlador para obtener una palabra específica por ID
export const getWord = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener y convertir el ID de los parámetros de la ruta
    const id = parseInt(req.params.id);
    
    // Buscar la palabra en el servicio
    const word = await wordService.getWordById(id);
    
    // Si no se encuentra la palabra, devolver error 404
    if (!word) {
      res.status(404).json({ error: 'Word not found' });
      return;
    }
    
    // Devolver la palabra encontrada
    res.json(word);
  } catch (error) {
    // Manejar errores de búsqueda
    res.status(500).json({ error: 'Failed to fetch word' });
  }
};

// Controlador para crear una nueva palabra
export const createWord = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener palabra y definición del cuerpo de la petición
    const { word, definition } = req.body;
    
    // Validar que ambos campos estén presentes
    if (!word || !definition) {
      res.status(400).json({ error: 'Word and definition required' });
      return;
    }
    
    // Llamar al servicio para crear la palabra
    const newWord = await wordService.createWord({ word, definition });
    
    // Devolver la nueva palabra con código 201 (Created)
    res.status(201).json(newWord);
  } catch (error: any) {
    // Manejar error de palabra duplicada
    if (error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
      return;
    }
    // Manejar otros errores
    res.status(500).json({ error: 'Failed to create word' });
  }
};

// Controlador para actualizar una palabra existente
export const updateWord = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener ID de la palabra a actualizar
    const id = parseInt(req.params.id);
    
    // Obtener nuevos datos del cuerpo de la petición
    const { word, definition } = req.body;
    
    // Llamar al servicio de actualización
    const success = await wordService.updateWord(id, { word, definition });
    
    // Si no se encontró la palabra, devolver error 404
    if (!success) {
      res.status(404).json({ error: 'Word not found' });
      return;
    }
    
    // Devolver confirmación de éxito
    res.json({ success: true });
  } catch (error) {
    // Manejar errores de actualización
    res.status(500).json({ error: 'Failed to update word' });
  }
};

// Controlador para eliminar una palabra
export const deleteWord = async (req: Request, res: Response): Promise<void> => {
  try {
    // Obtener ID de la palabra a eliminar
    const id = parseInt(req.params.id);
    
    // Llamar al servicio de eliminación
    const success = await wordService.deleteWord(id);
    
    // Si no se encontró la palabra, devolver error 404
    if (!success) {
      res.status(404).json({ error: 'Word not found' });
      return;
    }
    
    // Devolver confirmación de éxito
    res.json({ success: true });
  } catch (error) {
    // Manejar errores de eliminación
    res.status(500).json({ error: 'Failed to delete word' });
  }
};