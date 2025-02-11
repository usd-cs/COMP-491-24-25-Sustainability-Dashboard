import { Router } from 'express';
import { getEnergySummary } from './table_controller';

const router = Router();

// Route to get all records from the uploaded table
router.get('/getenergy', getEnergySummary);


export default router;
