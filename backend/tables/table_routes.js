import { Router } from 'express';
import { getEnergySummary } from './table_controller.js';


const router = Router();

// Route to get all records from the uploaded table
router.post('/api/tables/getenergy', getEnergySummary);


export default router;
