import pkg from 'pg'; // Import the CommonJS module as a default
const { Pool } = pkg; // Destructure Pool from the default import


const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: '5434',
  database: 'postgres',
});
// to be determined after setting up sql database

export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
};