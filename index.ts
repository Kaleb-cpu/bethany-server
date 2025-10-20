import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  host: 'localhost',
  port: 2000,
  database: 'bethany',
  user: 'postgres',
  password: 'Bethany',
});

// Test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    res.json({ message: 'Database connected successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Get artists endpoint
app.get('/api/artists', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, artist_name FROM artists');
    res.json({ 
      connected: true,
      artists: result.rows 
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      connected: false,
      error: 'Failed to fetch artists' 
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
});