import { Router } from 'express';
import { uploadFile } from './upload_controller.js';
import upload from './uploadMiddleware.js';

const router = Router();

router.post('/file-upload', upload.single('file'), uploadFile);


export default router;