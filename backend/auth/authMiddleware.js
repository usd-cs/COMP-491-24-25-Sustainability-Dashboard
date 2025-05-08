/**
 * @file authMiddleware.js
 * @description Middleware for verifying JSON Web Tokens (JWT) in incoming requests.
 * The token must be provided in the Authorization header in the format "Bearer <token>".
 * If the token is missing or invalid, the middleware returns an appropriate HTTP error response.
 * If the token is valid, the decoded token payload is attached to the request object (req.user)
 * and the request is passed on to the next middleware/controller.
 */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
    // Expect the token in the Authorization header formatted as "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token missing.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('JWT verification error:', err);
            return res.status(401).json({ message: 'Invalid token.' });
        }
        // Attach decoded info to the request
        req.user = decoded;
        next();
    });
};