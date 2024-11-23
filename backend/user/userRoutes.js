import { Router } from 'express';
import { uploadFile } from './userController.js';
import { isAuthenticated } from './authMiddleware.js';

const userRouter = Router();

// File upload route (protected)
userRouter.post('/file-upload', isAuthenticated, uploadFile);

export default userRouter;