import { query } from '../database_connection.js';
import { get30DayEnergyTotals, getBubbleChartData } from './table_queries.js';

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
 * Fetch 30-day energy totals
 */
export const getEnergySummary = async (req, res) => {
    try {
      const data = await get30DayEnergyTotals();
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
