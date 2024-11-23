import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key'; // Placeholder for secret key

export const isAuthenticated = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};