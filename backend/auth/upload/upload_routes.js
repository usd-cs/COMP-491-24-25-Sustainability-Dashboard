import { Router } from 'express';
import { uploadFile, uploadAthenaFile } from './upload_controller.js';
import upload from './uploadMiddleware.js';

const router = Router();

router.post('/file-upload', upload.single('file'), uploadFile);
router.post('/athena-upload', upload.single('file'), uploadAthenaFile);
// router.post('/fetch-energy-data', fetchAndStoreEnergyData);

export default router;