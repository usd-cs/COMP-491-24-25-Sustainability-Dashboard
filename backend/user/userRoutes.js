import { Router } from 'express';
import uploadDoc from './uplooad/upload_routes.js';
import { isAuthenticated } from '../auth/controller.js';

const userRouter = Router();

// File upload route (protected)
userRouter.post('/file-upload', isAuthenticated, uploadDoc);

export default userRouter;