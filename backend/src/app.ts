import express from 'express';
import cors from 'cors';
import pool from './db'; // MySQL conneción
import { Word } from './models/word'; //futuro
import wordsRouter from './routes/words.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/words', wordsRouter);

app.get('/', (req, res) => {
  res.send('Dictionary API Running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(errorHandler);