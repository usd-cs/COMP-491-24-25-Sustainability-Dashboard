/**
 * @file autoDB_refresh.js
 * @description Script that handles automating updating database with Bloom Energy API data at set intervals
 * It utulizes the `node-cron` package to schedule the use of the fetchAPIdata.js script 
 * for updating the database with the latest info from the Bloom Energy API
 */

import cron from 'node-cron';
import { fetchAndStoreEnergyData } from '../upload/fetchApiData.js';

// Schedule a cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('Running scheduled task: fetchAndStoreEnergyData');
    await fetchAndStoreEnergyData();
    console.log('Scheduled task completed successfully');
  } catch (error) {
    console.error('Error running scheduled task:', error.message);
  }
});

// Keep the process running
console.log('Cron job scheduled. Waiting for tasks...');
