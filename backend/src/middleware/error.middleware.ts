import { Request, Response, NextFunction } from 'express';

/**
 * Manejador centralizado de errores para la API
 * 
 * @param err - El objeto de error capturado
 * @param req - Objeto de petición de Express
 * @param res - Objeto de respuesta de Express
 * @param next - Función para pasar al siguiente middleware
 * 
 * @description 
 * Este middleware captura todos los errores que ocurren en las rutas
 * y devuelve una respuesta JSON estandarizada con el mensaje de error.
 * Además, registra el error completo en la consola para debugging.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Registrar el error completo en la consola (importante para debugging)
  console.error(err.stack);

  // 2. Responder al cliente con:
  //    - Código de estado HTTP 500 (Error interno del servidor)
  //    - Mensaje de error en formato JSON
  res.status(500).json({ 
    error: err.message       // Mensaje legible del error
    // NOTA: En producción, considerar no enviar detalles sensibles
  });
  
  // 3. NOTA: No llamamos a next() porque este es el último middleware
  //    en la cadena de manejo de errores
};