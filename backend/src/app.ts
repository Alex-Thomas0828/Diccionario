import express from 'express';
import cors from 'cors';
import pool from './db';
import wordsRouter from './routes/words.routes';
import { errorHandler } from './middleware/error.middleware';
import * as dotenv from 'dotenv';
import type { Request, Response } from 'express';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enhanced CORS configuration
const allowedOrigins = [
  'http://localhost:19006',    // Expo web
  'exp://192.168.1.X:19000',  // Your Expo app URL
  'http://localhost:8081',    // React Native web
  'http://localhost:3000',    // Common frontend port
  process.env.FRONTEND_URL    // From environment variables
].filter(Boolean) as string[]; // Remove any undefined values

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.warn(`Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: pool ? 'connected' : 'disconnected'
  });
});

// API routes
app.use('/api/words', wordsRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Dictionary API',
    version: '1.0.0',
    docs: `${req.protocol}://${req.get('host')}/api-docs`
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling (must be last middleware)
app.use(errorHandler);

// Database connection verification
pool.getConnection()
  .then(connection => {
    console.log('Database connection established');
    connection.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

// Server startup
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Server running on port ${PORT}
  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  █                       █
  █   Dictionary API      █
  █   Environment: ${process.env.NODE_ENV || 'development'}  █
  █                       █
  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  `);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    pool.end().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    pool.end().then(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});