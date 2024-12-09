import { query } from '../database_connection.js';

/**
 * @file queryUserByEmail.js
 * @description Function to query a user by their email address from the database.
 * 
 * Features:
 * - Retrieves all user information for a given email address from the `users` table.
 * - Uses parameterized queries to prevent SQL injection attacks.
 * 
 * @function queryUserByEmail
 * @async
 * @param {string} email - The email address of the user to query.
 * 
 * @returns {Promise<Object[]>} Resolves to an array of user objects. If no user is found, the array will be empty.
 **/

// Query to get user by email
export const queryUserByEmail = async (email) => {
  const sql = 'SELECT * FROM public."users" WHERE email = $1'; // Assuming the column is `email`
  return await query(sql, [email]);
};


