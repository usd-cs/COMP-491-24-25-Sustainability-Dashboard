import axios from 'axios';
import { query } from '../../database_connection.js';
import dotenv from 'dotenv';
dotenv.config();


let token = null; // Store token globally
let siteID = null; // Store site ID globally

/**
 * Retrieves an authentication token from the Bloom Energy API.
 * If the token is expired or missing, this function fetches a new one.
 */
const getAuthToken = async () => {
  try {
    const response = await axios.post(process.env.TOKEN_URL, {
      username: process.env.BLOOM_USERNAME,
      password: process.env.BLOOM_PASSWORD,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    token = response.data.token;
    console.log('New token obtained');
  } catch (error) {
    console.error('Error getting token:', error.message);
    throw new Error('Authentication failed');
  }
};

/**
 * Fetches the site ID associated with the authenticated user.
 * @returns {Promise<string>} The site ID retrieved from the Bloom Energy API.
 */
const fetchSiteID = async () => {
  if (!token) await getAuthToken();

  try {
    const response = await axios.get(process.env.BLOOM_SITE_ID, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.data || !response.data[0]) throw new Error('No site found');

    siteID = response.data[0].id; // Set the global siteID variable
    return siteID;
  } catch (error) {
    console.error('Error fetching site ID:', error.message);
    throw new Error('Failed to fetch site ID');
  }
};

/**
 * Fetches energy data from the Bloom Energy API for a date.
 * @param {string} siteID - The ID of the site to fetch data for.
 * @param {string} fromDate - The date for which to retrieve data (YYYY-MM-DD).
 * @returns {Promise<Object>} The energy data object retrieved from the API.
 */
const fetchSiteData = async (siteID, fromDate) => {
  if (!token) await getAuthToken();

  try {
    const response = await axios.post(`${process.env.BLOOM_SITE_DATA}/${siteID}/data-extract`, {
      metrics: ["total_output_factor", "efficiency", "energy", "fuel"],
      timeinterval: "daily",
      timeframe: "custom",
      from: fromDate,
      to: fromDate
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data?.data?.[0] || null;
  } catch (error) {
    console.error('Error fetching site data:', error.message);
    throw new Error('Failed to fetch site data');
  }
};

/**
 * Inserts energy data into the PostgreSQL database.
 * If a record for the same date already exists, it updates the existing record.
 * @param {Object} data - The energy data object containing total_output_factor, efficiency, energy, and fuel.
 */
const storeDataInDB = async (data) => {
  if (!data) {
    console.error('No data available to store');
    return;
  }

  const insertQuery = `
    INSERT INTO public.energy_daily_data (date_local, total_output_factor_percent, ac_efficiency_lhv_percent, electricity_out_kwh, gas_flow_in_therms)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (date_local) DO UPDATE
    SET total_output_factor_percent = EXCLUDED.total_output_factor_percent,
        ac_efficiency_lhv_percent = EXCLUDED.ac_efficiency_lhv_percent,
        electricity_out_kwh = EXCLUDED.electricity_out_kwh,
        gas_flow_in_therms = EXCLUDED.gas_flow_in_therms;
  `;

  const values = [
    new Date().toISOString().split('T')[0], // Today's date
    data.total_output_factor || 0,
    data.efficiency || 0,
    data.energy || 0,
    data.fuel || 0
  ];

  try {
    await query(insertQuery, values);
    console.log('Data stored successfully');
  } catch (error) {
    console.error('Error storing data:', error.message);
  }
};

/**
 * Fetches energy data from the Bloom Energy API and stores it in the database.
 * This function is designed to be triggered via an API route or scheduled job.
 * @param {Object} req - Express request object (not used, but required for API route).
 * @param {Object} res - Express response object to return success or failure message.
 */
export const fetchAndStoreEnergyData = async (req, res) => {
  try {
    const siteID = await fetchSiteID();
    const fromDate = new Date().toISOString().split('T')[0]; // Fetch today's data
    const siteData = await fetchSiteData(siteID, fromDate);
    
    console.log('Fetched Data:', siteData); // Debugging log
    await storeDataInDB(siteData);

    res.status(200).json({ message: 'Energy data successfully fetched and stored.' });
  } catch (error) {
    console.error('Error fetching and storing energy data:', error.message);
    res.status(500).json({ message: 'Failed to fetch and store energy data.' });
  }
};
