import { Router } from 'express';
import { uploadFile } from './upload_controller';
import upload from './uploadMiddleware';

const uploadRouter = Router();

router.post('/', upload.single('file'), uploadFile);

export default uploadRouter;