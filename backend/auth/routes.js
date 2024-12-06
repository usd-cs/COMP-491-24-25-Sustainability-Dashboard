import { Router } from 'express';
import { loginUser } from './controller.js';

const router = Router();

// Login route
router.post('/login', loginUser);

export default router;
