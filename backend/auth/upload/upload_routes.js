import { Router } from 'express';
import { uploadFile, uploadAthenaFile } from './upload_controller.js';
import upload from './uploadMiddleware.js';
import { verifyToken } from '../authMiddleware.js';

const router = Router();

router.post('/file-upload', verifyToken, upload.single('file'), uploadFile);
router.post('/athena-upload', verifyToken, upload.single('file'), uploadAthenaFile);
// router.post('/fetch-energy-data', fetchAndStoreEnergyData);

export default router;