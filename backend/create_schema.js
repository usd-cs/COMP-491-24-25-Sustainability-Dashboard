import pkg from 'pg'; // Import the CommonJS module for PostgreSQL
const { Pool } = pkg; // Destructure `Pool` from the imported package

/**
 * @file create_schema.js
 * @description This script sets up the database schema for the project, including the creation of tables:
 * `users`, `energy_30_day_totals`, and `energy_daily_data`. It uses transactions to ensure data integrity.
 */

// Initialize the database connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'database', // Change 'localhost' to 'database'
  port: process.env.DB_PORT || 5432,       // PostgreSQL default port
  database: process.env.DB_NAME || 'postgres',
});

/**
 * @async
 * @function createSchema
 * @description Creates the schema for the database, including all necessary tables.
 * Uses transactions to ensure the integrity of the operations. If an error occurs,
 * the transaction is rolled back.
 * 
 * - `users` table: Stores user information.
 * - `energy_30_day_totals` table: Stores aggregated energy data over 30 days.
 * - `energy_daily_data` table: Stores daily energy data.
 * 
 * @returns {Promise<void>} Logs success or error messages to the console.
 */
const createSchema = async () => {
  const client = await pool.connect(); // Connect to the database

  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Create `users` table to store user credentials and metadata
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY, -- Unique user identifier
        username VARCHAR(50) NOT NULL UNIQUE, -- Username (must be unique)
        email VARCHAR(100) NOT NULL UNIQUE, -- Email address (must be unique)
        password_hash VARCHAR(255) NOT NULL, -- Encrypted password
        role VARCHAR(20) DEFAULT 'user', -- User role (default is 'user')
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for creation
        last_login TIMESTAMP -- Timestamp for last login
      );
    `);
    console.log("Table 'users' created successfully.");

    // Create `energy_30_day_totals` table to store summarized energy data
    await client.query(`
      CREATE TABLE IF NOT EXISTS energy_30_day_totals (
        id SERIAL PRIMARY KEY, -- Unique identifier for the record
        Total_Output_Factor_Percent DECIMAL(5, 2), -- Efficiency percentage
        AC_Efficiency_LHV_Percent DECIMAL(5, 2), -- Lower heating value efficiency
        Heat_Rate_HHV_BTU_per_kWh DECIMAL(10, 2), -- Heat rate in BTU/kWh
        Electricity_Out_kWh INT, -- Electricity output in kWh
        Gas_Flow_In_Therms INT, -- Gas flow in therms
        Gas_Flow_In_MMBtu DECIMAL(10, 2), -- Gas flow in MMBtu
        CO2_Reduction_lbs INT, -- CO2 reduction in lbs
        CO2_Production_lbs INT, -- CO2 production in lbs
        NOx_Reduction_lbs DECIMAL(10, 2), -- NOx reduction in lbs
        NOx_Production_lbs DECIMAL(10, 2), -- NOx production in lbs
        SO2_Reduction_lbs DECIMAL(10, 2), -- SO2 reduction in lbs
        SO2_Production_lbs DECIMAL(10, 2), -- SO2 production in lbs
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for creation
        user_id INT, -- Reference to the user who owns the data
        CONSTRAINT fk_user_30_day FOREIGN KEY (user_id) REFERENCES users(user_id) -- Foreign key constraint
      );
    `);
    console.log("Table 'energy_30_day_totals' created successfully.");

    // Create `energy_daily_data` table to store daily energy metrics
    await client.query(`
      CREATE TABLE IF NOT EXISTS energy_daily_data (
        id SERIAL PRIMARY KEY, -- Unique identifier for the record
        Date_Local DATE NOT NULL, -- Local date for the record
        Total_Output_Factor_Percent DECIMAL(10, 5), -- Efficiency percentage
        AC_Efficiency_LHV_Percent DECIMAL(10, 5), -- Lower heating value efficiency
        Heat_Rate_HHV_BTU_per_kWh DECIMAL(10, 5), -- Heat rate in BTU/kWh
        Electricity_Out_kWh DECIMAL(10, 5), -- Electricity output in kWh
        Gas_Flow_In_Therms DECIMAL(10, 5), -- Gas flow in therms
        CO2_Reduction_lbs DECIMAL(10, 5), -- CO2 reduction in lbs
        CO2_Production_lbs DECIMAL(10, 5), -- CO2 production in lbs
        NOx_Reduction_lbs DECIMAL(10, 5), -- NOx reduction in lbs
        NOx_Production_lbs DECIMAL(10, 5), -- NOx production in lbs
        SO2_Reduction_lbs DECIMAL(10, 5), -- SO2 reduction in lbs
        SO2_Production_lbs DECIMAL(10, 5), -- SO2 production in lbs
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for creation
        user_id INT, -- Reference to the user who owns the data
        CONSTRAINT fk_user_daily FOREIGN KEY (user_id) REFERENCES users(user_id) -- Foreign key constraint
      );
    `);
    console.log("Table 'energy_daily_data' created successfully.");

    // Commit the transaction
    await client.query('COMMIT');
    console.log("Schema created successfully!");
  } catch (error) {
    console.error("Error creating schema:", error);
    await client.query('ROLLBACK'); // Rollback transaction on error
  } finally {
    client.release(); // Release the database client
  }
};

// Execute the schema creation
createSchema()
  .then(() => {
    console.log("Database setup complete!");
    pool.end(); // Close the database connection pool
  })
  .catch((error) => {
    console.error("Error setting up the database:", error);
    pool.end(); // Ensure the connection pool is closed
  });
