import dotenv from 'dotenv';
dotenv.config();

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
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
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
