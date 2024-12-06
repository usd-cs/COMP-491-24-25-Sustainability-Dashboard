import { queryUserByUsername } from './queries.js';

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
