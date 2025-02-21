import { Router } from 'express';
import { getEnergySummary, getBubbleChart } from './table_controller.js';

const router = Router();

// Temporary test route to verify router mounting
router.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// GET route for energy summary
router.get('/getenergy', getEnergySummary);

// GET route for bubble chart data
router.get('/getbubblechart', getBubbleChart);

export default router;
