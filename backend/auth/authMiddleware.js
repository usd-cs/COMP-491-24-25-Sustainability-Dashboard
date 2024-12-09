import { queryUserByUsername } from './queries.js';
/**
 * @description Middleware function to authenticate a user by username. This middleware verifies
 * the existence of a user in the database and attaches the user's information to the request object 
 * if authentication is successful.
 * 
 * Features:
 * - Validates the presence of the `username` field in the request body.
 * - Queries the database for a user with the provided username.
 * - Attaches the user information to the `req.user` object for downstream handlers.
 * - Returns appropriate HTTP status codes and error messages for different scenarios.
 * 
 * @function isAuthenticated
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express middleware function to call the next handler.
 * 
 * @returns {Object} Response with appropriate HTTP status code:
 * - `400 Bad Request`: If the `username` field is missing.
 * - `401 Unauthorized`: If no user is found with the provided username.
 * - `500 Internal Server Error`: If an error occurs during the database query.
 **/

export const isAuthenticated = async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const user = await queryUserByUsername(username);

    if (user.length === 0) {
      return res.status(401).json({ message: 'Unauthorized: User not found.' });
    }

    req.user = user[0]; // Attach user info to the request object
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Server error during authentication.' });
  }
};
