import { RowDataPacket } from 'mysql2';

/**
 * Interfaz que representa una palabra en el diccionario
 * 
 * @description
 * Define la estructura de datos de una palabra en el sistema,
 * incluyendo sus propiedades básicas y metadatos.
 */
export interface Word {
 id?: number;
 palabra: string;
 definicion: string;
 semantica?: string;
 categoria_grammatica?: string;
 ejemplo?: string;
 created_at?: string;
 updated_at?: string;
 created_by?: string;
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