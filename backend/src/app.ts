/**
 * Configuración principal del servidor API para el Diccionario
 * 
 * @module app
 * @description Configura Express, middlewares, rutas y manejo de errores
 */

import express from 'express';
import cors from 'cors';
import pool from './db';
import wordsRouter from './routes/words.routes';
import { errorHandler } from './middleware/error.middleware';
import * as dotenv from 'dotenv';
import type { Request, Response } from 'express';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Configuración de CORS (Intercambio de Recursos de Origen Cruzado)
 * @constant {Array<string>} allowedOrigins - Lista de orígenes permitidos
 */
const allowedOrigins = [
  'http://localhost:19006',    // Entorno web de Expo
  'exp://192.168.1.X:19000',  // URL de la app Expo en dispositivo físico
  'http://localhost:8081',    // Entorno web de React Native
  'http://localhost:3000',    // Puerto frontend común
  process.env.FRONTEND_URL    // URL de frontend desde variables de entorno
].filter(Boolean) as string[]; // Filtra valores undefined

/**
 * Opciones de configuración para CORS
 * @type {cors.CorsOptions}
 */
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permite peticiones sin origen (apps móviles, solicitudes curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`Petición CORS bloqueada desde: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
};

// ======================
// Middlewares
// ======================

/**
 * Middleware para habilitar CORS
 */
app.use(cors(corsOptions));

/**
 * Middleware para parsear JSON en las solicitudes
 */
app.use(express.json());

/**
 * Middleware para parsear datos de formularios
 */
app.use(express.urlencoded({ extended: true }));

// ======================
// Endpoints
// ======================

/**
 * Endpoint de salud (health check)
 * @route GET /health
 * @returns {Object} Estado del servidor y base de datos
 */
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: pool ? 'connected' : 'disconnected'
  });
});

/**
 * Rutas principales de la API para palabras
 * @namespace /api/words
 */
app.use('/api/words', wordsRouter);

/**
 * Endpoint raíz
 * @route GET /
 * @returns {Object} Información básica de la API
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Dictionary API',
    version: '1.0.0',
    docs: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// ======================
// Manejo de errores
// ======================

/**
 * Middleware para manejar rutas no encontradas (404)
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

/**
 * Middleware para manejo centralizado de errores
 * @important Debe ser el último middleware
 */
app.use(errorHandler);

// ======================
// Conexión a base de datos
// ======================

/**
 * Verificación de conexión a la base de datos MySQL
 */
pool.getConnection()
  .then(connection => {
    console.log('Conexión a la base de datos establecida');
    connection.release();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Termina el proceso si no puede conectar a la DB
  });

// ======================
// Inicialización del servidor
// ======================

/**
 * Inicia el servidor HTTP
 */
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Servidor ejecutándose en el puerto ${PORT}
  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  █                       █
  █   API del Diccionario █
  █   Entorno: ${process.env.NODE_ENV || 'development'}  █
  █                       █
  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  `);
});

// ======================
// Manejo de apagado
// ======================

/**
 * Maneja señales de terminación para apagado limpio
 */
process.on('SIGTERM', () => {
  console.log('Recibida señal SIGTERM. Apagando limpiamente...');
  server.close(() => {
    console.log('Servidor cerrado');
    pool.end().then(() => {
      console.log('Conexión a base de datos cerrada');
      process.exit(0);
    });
  });
});

/**
 * Maneja señales de interrupción (Ctrl+C)
 */
process.on('SIGINT', () => {
  console.log('Recibida señal SIGINT. Apagando limpiamente...');
  server.close(() => {
    console.log('Servidor cerrado');
    pool.end().then(() => {
      console.log('Conexión a base de datos cerrada');
      process.exit(0);
    });
  });
});