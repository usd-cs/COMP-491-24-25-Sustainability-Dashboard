import dotenv from 'dotenv';
dotenv.config();


// queryDebug.js
import { queryUserByEmail } from './queries.js'; // Adjust the path if necessary
import bcrypt from 'bcrypt';
/*
@description A script to debug and verify user authentication by querying the database for a user 
 * with a specified email and comparing the provided plain text password with the stored hashed password.
 * 
 * This script performs the following steps:
 * 1. Queries the database for a user with a given email.
 * 2. Extracts the hashed password for the user from the query result.
 * 3. Compares the provided plain text password with the hashed password using bcrypt.
 * 4. Logs whether the password matches or not.
 * 
 * @requires bcrypt - For comparing hashed passwords.
 * @requires ./queries.js - A module containing the `queryUserByEmail` function for querying the database.
 */

(async () => {
  try {
    // Email to test
    const emailToTest = process.env.TEST_USER_EMAIL || 'johnalejandro@sandiego.edu';
    const plainPassword = process.env.TEST_USER_PASSWORD || 'pw123';

    console.log(`Testing query for email: ${emailToTest}`);

    // Query the database for the user
    const result = await queryUserByEmail(emailToTest);
    console.log('Query result:', result);

    if (result.length === 0) {
      console.log('No user found with that email.');
      return;
    }

    // Extract the hashed password from the result
    const storedHashedPassword = result[0].password_hash; // Use password_hash field
    console.log('Stored hashed password:', storedHashedPassword);

    // Verify the provided plain password with the stored hashed password
    const passwordMatch = await bcrypt.compare(plainPassword, storedHashedPassword);
    console.log('Password match:', passwordMatch);

    if (passwordMatch) {
      console.log('Password is correct!');
    } else {
      console.log('Password is incorrect.');
    }
  } catch (error) {
    console.error('Error during query debugging:', error);
  }
})();
