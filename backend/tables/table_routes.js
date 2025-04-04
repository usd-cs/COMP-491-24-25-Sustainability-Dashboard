import { Router } from 'express';
import { getEnergySummary, getBubbleChart, getAthenaEnergyData } from './table_controller.js';
import { getPieChartData, uploadPieChartCSV } from './table_controller.js';
import multer from 'multer';



const router = Router();
const upload = multer({ dest: 'uploads/' });


// Temporary test route to verify router mounting
router.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// GET route for energy summary
router.get('/getenergy', getEnergySummary);

// GET route for bubble chart data
router.get('/getbubblechart', getBubbleChart);

// GET route for athena data
router.get('/getathenaenergy', getAthenaEnergyData);


// GET route for retrieving Pie Chart Data
router.get('/getPieChartData', getPieChartData);
router.post('/upload-piechart-csv', upload.single('file'), uploadPieChartCSV);

export default router;
