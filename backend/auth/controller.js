import { queryUserByEmail } from './queries.js';
import bcrypt from 'bcrypt';

/**
 * @file loginUser.js
 * @description Function to handle user login by validating credentials (email and password). 
 * If the credentials match, the user is authenticated, and their details are returned.
 * 
 * Features:
 * - Validates the presence of `email` and `password` fields in the request body.
 * - Queries the database for a user by their email.
 * - Verifies the provided password against the stored hashed password using bcrypt.
 * - Returns appropriate HTTP status codes and messages for different scenarios.
 * 
 * @function loginUser
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The request body containing `email` and `password`.
 * @param {Object} res - Express response object.
 * 
 * @returns {Object} Response with appropriate HTTP status code
 **/

export const loginUser = async (req, res) => {
  const { email, password } = req.body; // Expecting email and password from the request

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Query the user by email
    const user = await queryUserByEmail(email);

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Retrieve the hashed password from the database
    const storedHashedPassword = user[0].password_hash;

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Respond with user details if the login is successful
    res.status(200).json({
      message: 'Login successful',
      user: {
        user_id: user[0].user_id,
        username: user[0].username,
        email: user[0].email,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
