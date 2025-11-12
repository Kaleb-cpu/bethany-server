// src/lib/server/db.js
import 'dotenv/config'
import { Pool } from 'pg'

/**
 * Handles connections for artist uploads and user streaming.
 */
export const pool = new Pool({
  max: 20, // Up to 20 clients active at once
  idleTimeoutMillis: 30000, // Close unused connections after 30s
  connectionTimeoutMillis: 2000, // Wait up to 2s for a free client
})

// Log if a client in the pool errors out unexpectedly
pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err)
})

/**
 * Graceful shutdown handler
 * Ensures all open DB connections close cleanly when the app stops.
 */
async function shutdownPool() {
  console.log('shutting down database connection pool...')
  try {
    await pool.end()
    console.log('Pool closed cleanly. Bye 🎤')
  } catch (err) {
    console.error('Error closing pool:', err)
  } finally {
    process.exit(0)
  }
}

// Handle Ctrl+C or container stop events
process.on('SIGINT', shutdownPool)
process.on('SIGTERM', shutdownPool)
