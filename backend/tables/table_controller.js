import { query } from '../database_connection.js';
import { get30DayEnergyTotals, getBubbleChartData, getAthenaTables, getTreeVisualizationData } from './table_queries.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

/**
 * Fetch all data from `energy_daily_data`
 */
export const getAllData = async (req, res) => {
    try {
        const result = await query('SELECT * FROM public.energy_daily_data');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ message: 'Failed to retrieve data.' });
    }
};
/**
 * Get the final Athena data for the graph - only get the data under timestamp and building name column
 */

// Function to handle the request
export const getAthenaDataForGraph = async (req, res) => {
    console.log('Request received:', req);

    // Log specific parts of the request
    console.log('Query parameters:', req.query);
    console.log('Headers:', req.headers);
    
    const { buildingName } = req.query; // Get building name from the URL parameter
    
    // Validate that buildingName is provided
    if (!buildingName) {
        return res.status(400).json({ message: 'Building name is required.' });
    }
    try {
      // Fetch Athena data for the building
      const data = await getAthenaTables(buildingName);
  
      // Check if data is available
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No data found for this building.' });
      }
  
      // Send the data as a response
      return res.status(200).json(data);
    } catch (globalError) {
        console.error('Global error in getAthenaDataForGraph:', {
            message: globalError.message,
            stack: globalError.stack,
            queryParameters: req.query,
            headers: req.headers,
            url: req.originalUrl
        });
        return res.status(500).json({ message: 'Failed to retrieve Athena data for the graph.' });
    }
    
  };
  

/**
 * Fetch 30-day energy totals
 */
export const getEnergySummary = async (req, res) => {
    try {
        const data = await get30DayEnergyTotals();
        // Check if all values are zero (indicating no real data)
        const hasData = Object.values(data).some(value => value !== 0);
        if (!hasData) {
            return res.status(404).json({ 
                message: 'No energy data found for the last 30 days.'
            });
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching energy summary:', error);
        res.status(500).json({ message: 'Failed to retrieve energy summary.' });
    }
};

/**
 * Fetch data for bubble chart
 */
export const getBubbleChart = async (req, res) => {
    try {
        const data = await getBubbleChartData();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching bubble chart data:', error);
        res.status(500).json({ message: 'Failed to retrieve bubble chart data.' });
    }
};

/**
 * Fetch data for tree visualization.
 */
export const getTreeData = async (req, res) => {
    try {
      // Get the period from the query string; default to "month" if not provided.
      const period = req.query.period || "month";
      
      const data = await getTreeVisualizationData(period);
      
      if (!data || data.length === 0) {
        return res.status(404).json({ 
          message: 'No tree visualization data available'
        });
      }
      
      console.log(`Returning ${data.length} records of tree data`);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error in getTreeData controller:', error);
      res.status(500).json({ 
        message: 'Failed to retrieve tree visualization data',
        error: error.message 
      });
    }
  };


// Set up the directory where CSV files will be stored
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'sources-of-electricity_edit.xlsx'); // Always overwrite the old file
    }
});
const upload = multer({ storage });

/**
 * Upload file for Pie Chart
 */
export const uploadPieChartCSV = upload.single('file');


/**
 * Fetch Pie Chart Data from the latest uploaded CSV
 */
export const getPieChartData = async (req, res) => {
    try {
        const filePath = path.join(uploadDir, 'sources-of-electricity_edit.xlsx');

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'No XLSX file found' });
        }

        const fileBuffer = fs.readFileSync(filePath);
        res.setHeader('Content-Disposition', 'attachment; filename=sources-of-electricity_edit.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(fileBuffer);
    } catch (error) {
        console.error('Error fetching XLSX file:', error);
        res.status(500).json({ message: 'Failed to retrieve XLSX file.' });
    }
};
