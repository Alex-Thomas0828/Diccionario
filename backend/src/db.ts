/**
 * Módulo de conexión a la base de datos MySQL
 * @module Database
 * @description Configura y exporta un pool de conexiones a MySQL
 */

import { createPool } from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

/**
 * Pool de conexiones a la base de datos MySQL
 * @constant {Pool}
 * @description Configuración del pool de conexiones usando variables de entorno:
 * - DB_HOST: Host de la base de datos
 * - DB_USER: Usuario de la base de datos  
 * - DB_PASSWORD: Contraseña del usuario
 * - DB_NAME: Nombre de la base de datos
 * 
 * Opciones adicionales:
 * - waitForConnections: Espera por conexiones disponibles cuando el pool está lleno
 * - connectionLimit: Límite máximo de conexiones en el pool (10)
 */
const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

/**
 * Verifica la conexión a la base de datos
 * @function
 * @description Intenta obtener una conexión del pool para validar la configuración:
 * - Si tiene éxito, libera la conexión y muestra mensaje
 * - Si falla, registra el error y termina el proceso
 */
pool.getConnection()
  .then(conn => {
    console.log('Conexión exitosa a la base de datos MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Termina la aplicación con código de error
  });

/**
 * Exporta el pool de conexiones configurado
 * @default
 * @type {Pool}
 */
export default pool;