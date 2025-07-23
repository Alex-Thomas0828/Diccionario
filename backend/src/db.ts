// src/db.ts
import { createPool } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();



const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

pool.getConnection()
  .then(conn => {
    console.log('Successfully connected to MySQL database');
    conn.release();
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

export default pool;