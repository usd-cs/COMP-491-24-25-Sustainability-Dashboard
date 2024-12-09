import pkg from 'pg'; // Import the CommonJS module as a default
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: '5434',
    database: 'postgres',
  });
  // to be determined after setting up sql database

// Function to create the schema
const createSchema = async () => {
  const client = await pool.connect();

  try {
    // Begin a transaction
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);

    console.log("Table 'users' created successfully.");

    // Create energy_30_day_totals table
    await client.query(`
      CREATE TABLE IF NOT EXISTS energy_30_day_totals (
        id SERIAL PRIMARY KEY,
        Total_Output_Factor_Percent DECIMAL(5, 2),
        AC_Efficiency_LHV_Percent DECIMAL(5, 2),
        Heat_Rate_HHV_BTU_per_kWh DECIMAL(10, 2),
        Electricity_Out_kWh INT,
        Gas_Flow_In_Therms INT,
        Gas_Flow_In_MMBtu DECIMAL(10, 2),
        CO2_Reduction_lbs INT,
        CO2_Production_lbs INT,
        NOx_Reduction_lbs DECIMAL(10, 2),
        NOx_Production_lbs DECIMAL(10, 2),
        SO2_Reduction_lbs DECIMAL(10, 2),
        SO2_Production_lbs DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INT,
        CONSTRAINT fk_user_30_day FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `);

    console.log("Table 'energy_30_day_totals' created successfully.");

    // Create energy_daily_data table
    await client.query(`
      CREATE TABLE IF NOT EXISTS energy_daily_data (
        id SERIAL PRIMARY KEY,
        Date_Local DATE NOT NULL,
        Total_Output_Factor_Percent DECIMAL(10, 5),
        AC_Efficiency_LHV_Percent DECIMAL(10, 5),
        Heat_Rate_HHV_BTU_per_kWh DECIMAL(10, 5),
        Electricity_Out_kWh DECIMAL(10, 5),
        Gas_Flow_In_Therms DECIMAL(10, 5),
        CO2_Reduction_lbs DECIMAL(10, 5),
        CO2_Production_lbs DECIMAL(10, 5),
        NOx_Reduction_lbs DECIMAL(10, 5),
        NOx_Production_lbs DECIMAL(10, 5),
        SO2_Reduction_lbs DECIMAL(10, 5),
        SO2_Production_lbs DECIMAL(10, 5),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INT,
        CONSTRAINT fk_user_daily FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `);

    console.log("Table 'energy_daily_data' created successfully.");

    // Commit the transaction
    await client.query('COMMIT');
    console.log("Schema created successfully!");
  } catch (error) {
    console.error("Error creating schema:", error);
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
};

// Run the schema creation
createSchema()
  .then(() => {
    console.log("Database setup complete!");
    pool.end();
  })
  .catch((error) => {
    console.error("Error setting up the database:", error);
    pool.end();
  });
