import { Router } from 'express';
import { uploadFile } from './upload_controller';

const router = Router();

router.post('/', uploadFile);

export default router;