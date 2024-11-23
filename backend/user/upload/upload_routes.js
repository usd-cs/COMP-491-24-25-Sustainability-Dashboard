import { Router } from 'express';
import { uploadFile } from './upload_controller';

const uploadRouter = Router();

router.post('/', upload.single('file'), uploadFile);

export default uploadRouter;