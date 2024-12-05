import pkg from 'pg'; // Import the CommonJS module as a default
import bcrypt from 'bcrypt'; // Library for hashing passwords

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
