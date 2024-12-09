import pkg from 'pg'; // Import the CommonJS module as a default
import bcrypt from 'bcrypt'; // Library for hashing passwords

/** @description Script to set up the first user in the database. It inserts a new user into the `users` table with 
 * hashed password storage for security. This script can later be modified to allow user registration with 
 * an admin-provided key.
 * 
 * Features:
 * - Hashes passwords using bcrypt for secure storage.
 * - Inserts a new user into the database inside a transaction.
 * - Rolls back the transaction in case of any errors.
 * 
 * @function addUser
 * @async
 * @param {string} username - The username of the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} password - The plaintext password to be hashed and stored.
 * 
 * @returns {void} Outputs success or error messages to the console.
 **/

const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: '5434',
  database: 'postgres',
});

const addUser = async (username, email, password) => {
  const client = await pool.connect();

  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Hash the password using bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert the new user
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [username, email, passwordHash];

    const result = await client.query(query, values);

    // Commit the transaction
    await client.query('COMMIT');

    console.log("New user added:", result.rows[0]);
  } catch (error) {
    console.error("Error adding user:", error);
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
};

// Add user 'johnalejandro'
addUser('johnalejandro', 'johnalejandro@sandiego.edu', 'pw123')
  .then(() => {
    console.log("User creation process complete!");
    pool.end();
  })
  .catch((error) => {
    console.error("Error during user creation process:", error);
    pool.end();
  });
