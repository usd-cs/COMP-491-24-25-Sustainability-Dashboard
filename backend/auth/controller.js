import { queryUserByUsername } from './queries.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
/**
 * @file controller.js
 * @description Contains the function for handling user login by verifying credentials (username and password).
 * After successful authentication, this module issues a JSON Web Token (JWT) that encapsulates the user's
 * identity information. The token is used for authorizing subsequent API requests.
 *
 * Features:
 * - Validates that both 'username' and 'password' are provided in the request body.
 * - Queries the database for the user with the given username.
 * - Compares the provided password against the stored hashed password using bcrypt.
 * - If credentials are valid, creates a JWT containing user details (user_id, username, email).
 * - Returns corresponding HTTP status codes and messages for missing credentials, authentication failures,
 *   and server errors.
 *
 * @function loginUser
 * @param {Object} req - Express request object.
 * @param {Object} req.body - Contains 'username' and 'password'.
 * @param {Object} res - Express response object.
 * @returns {Object} JSON response with token and user details on successful login, or an error message.
 */
export const loginUser = async (req, res) => {
  const { username, password } = req.body; // Expecting username and password from the request

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required.' });
  }

  try {
    // Query the user by username
    const user = await queryUserByUsername(username);

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Retrieve the hashed password from the database
    const storedHashedPassword = user[0].password_hash;

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    // Create a JWT token after successful authentication
    const tokenPayload = {
      user_id: user[0].user_id,
      username: user[0].username,
      email: user[0].email,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token, // Include token in the response
      user: tokenPayload,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
