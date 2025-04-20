import { Router } from 'express';
import { 
  // getAllData, 
  getEnergySummary, 
  getBubbleChart, 
  getAthenaDataForGraph,
  getPieChartData, 
  uploadPieChartCSV,
  getTreeData,
  getCombinedWeeklyData,
  getDailyEnergyData,
  getBloomDate,
  getAthenaDate
} from './table_controller.js';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Temporary test route to verify router mounting
router.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// GET route for timestamp for Bloom 
router.get('/bloomdate', getBloomDate);

// GET route for timestamp for Athena
router.get('/athenadate', getAthenaDate);

// GET route for energy summary
router.get('/getenergy', getEnergySummary);

// GET route for bubble chart data
router.get('/getbubblechart', getBubbleChart);

// drilldown (daily) must be before the aggregate route
router.get('/getcombinedweekly/daily', getDailyEnergyData);
router.get('/getcombinedweekly', getCombinedWeeklyData);

// GET route for Athena data filtered by building name
router.get('/hourlyenergybybuilding', getAthenaDataForGraph);

// GET route for retrieving Pie Chart Data
router.get('/getPieChartData', getPieChartData);
router.post('/upload-piechart-csv', upload.single('file'), uploadPieChartCSV);

// GET route for tree data
router.get('/gettreedata', getTreeData);

export default router;
