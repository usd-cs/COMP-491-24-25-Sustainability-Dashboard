import { Router } from 'express';
import uploadRouter from './upload/upload_routes.js';
// import { isAuthenticated } from '../auth/controller.js';

const userRouter = Router();

// File upload route (protected)
userRouter.post('/file-upload', uploadRouter);

export default userRouter;