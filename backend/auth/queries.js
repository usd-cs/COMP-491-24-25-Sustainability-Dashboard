import { query } from '../database_connection.js';

// Query to get user by email
export const queryUserByEmail = async (email) => {
  const sql = 'SELECT * FROM public."users" WHERE email = $1'; // Assuming the column is `email`
  return await query(sql, [email]);
};


