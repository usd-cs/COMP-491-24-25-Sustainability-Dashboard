import dotenv from 'dotenv';

// Load environment variables from the correct .env file
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: `./backend/${envFile}` });

import pkg from 'pg'; // Import the PostgreSQL module
const { Pool } = pkg; // Destructure Pool from the imported package

/** 
 * @description Establishes a connection to the PostgreSQL database using a connection pool.
 * 
 * Features:
 * - Provides a `query` function for executing SQL queries.
 * - Centralized database connection configuration for consistent usage.
 * 
 * @module database_connection
 * @exports query
 */

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'database',  // Change 'localhost' to 'database'
  port: process.env.DB_PORT || 5432,        // PostgreSQL default port inside Docker
  database: process.env.DB_NAME || 'postgres',
});

/**
 * Executes an SQL query on the database.
 * 
 * @async
 * @function query
 * @param {string} text - The SQL query text to be executed.
 * @param {Array<any>} params - The parameters to be passed into the query.
 * @returns {Promise<Array<object>>} The resulting rows from the query.
 * @throws Will throw an error if the query fails.
 */
export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};
