import { queryUserByUsername } from './queries.js';
import bcrypt from 'bcryptjs';

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query user by username
    const user = await queryUserByUsername(username);

    // Log the result to check if user was found and the password field
    console.log('User from DB:', user);

    if (user.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Log the hashed password stored in the DB
    console.log('Hashed password stored in DB:', user[0].password);

    // Compare provided password with hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Successful login
    res.status(200).json({
      message: 'Login successful',
      user: { user_id: user[0].user_id, username: user[0].username },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};