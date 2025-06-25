import { RowDataPacket } from 'mysql2';

/**
 * Interfaz que representa una palabra en el diccionario
 * 
 * @description
 * Define la estructura de datos de una palabra en el sistema,
 * incluyendo sus propiedades básicas y metadatos.
 */
export interface Word {
  /** ID único de la palabra (autoincremental) */
  id: number;
  
  /** La palabra en sí (única en el sistema) */
  word: string;
  
  /** El significado o definición de la palabra */
  definition: string;
  
  /** Fecha de creación en la base de datos */
  created_at: Date;
  
  /** Fecha de última actualización */
  updated_at: Date;
  
  /** 
   * ID del usuario que creó la palabra (opcional)
   * @optional
   */
  created_by?: number;
}

/**
 * Extensión de la interfaz Word para resultados de consultas MySQL
 * 
 * @description
 * Combina las propiedades de Word con RowDataPacket de mysql2
 * para tipar correctamente los resultados de las consultas a la BD.
 * Esto es necesario porque mysql2 devuelve objetos que implementan
 * RowDataPacket.
 */
export interface WordRow extends Word, RowDataPacket {}