import { Router } from 'express';
import { getEnergySummary } from './table_controller.js';

const router = Router();

// Temporary test route to verify router mounting
router.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// GET route for energy summary
router.get('/getenergy', getEnergySummary);

export default router;
