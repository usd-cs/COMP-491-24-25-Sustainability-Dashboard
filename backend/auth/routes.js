import { Router } from 'express';
import { loginUser } from './controller.js';
import uploadRouter from './upload/upload_routes.js';
import energyRouter from '../tables/table_routes.js';

const router = Router();

// Login route
router.post('/login', loginUser);
router.use(energyRouter);
// Include upload routes
router.use(uploadRouter);

export default router;







