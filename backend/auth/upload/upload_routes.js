import { Router } from 'express';
import { uploadFile } from './upload_controller';

const router = Router();

router.post('/upload', uploadFile);

export default router;