/**
 * Configuración principal del servidor API para el Diccionario
 * 
 * @module app
 * @description Configura Express, middlewares, rutas y manejo de errores
 */

import express, { Application }  from 'express';
import cors from 'cors';
import wordsRouter from './routes/words.routes';
import { errorHandler } from './middleware/error.middleware';
import * as dotenv from 'dotenv';
import type { Request, Response } from 'express';
import { supabase } from '../supabaseClient';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app: Application  = express();
const PORT = process.env.PORT || 3001;

/**
 * Configuración de CORS (Intercambio de Recursos de Origen Cruzado)
 * @constant {Array<string>} allowedOrigins - Lista de orígenes permitidos
 */
const allowedOrigins = [
  'http://localhost:19006',    // Entorno web de Expo
  'exp://192.168.1.X:19000',  // URL de la app Expo en dispositivo físico
  'http://localhost:8081',    // Entorno web de React Native
  process.env.FRONTEND_URL,   // URL de frontend desde variables de entorno
  process.env.EXPO_PUBLIC_API_URL,
  'https://diccionarioweb.vercel.app',  // URL de render.com API
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
app.get('/health', async (req: Request, res: Response) => {
  try{
    const {error} = await supabase
    .from('dictionary')
    .select('id')
    .limit(1);

    const dbStatus = error ? "not connected" : "connected";

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    })
    } catch (err) {
      console.error("error health on check: ", err);
      res.status(500).json({
        status: 'not healthy',
        timestamp: new Date().toISOString(),
        database: 'disonnected',
      })
    }
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

export default app;