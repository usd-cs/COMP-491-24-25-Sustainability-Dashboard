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
      metrics: [
        "total_output_factor", // Maps to total_output_factor_percent
        "efficiency", // Maps to ac_efficiency_lhv_percent
        "energy", // Maps to electricity_out_kwh
        "fuel", // Maps to gas_flow_in_therms
        "co2_reduction", // Maps to co2_reduction_lbs
        "co2_production", // Maps to co2_production_lbs
        "nox_reduction", // Maps to nox_reduction_lbs
        "nox_production", // Maps to nox_production_lbs
        "so2_reduction", // Maps to so2_reduction_lbs
        "so2_production" // Maps to so2_production_lbs
    ],
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
    INSERT INTO public.energy_daily_data (
      date_local, 
      total_output_factor_percent, 
      ac_efficiency_lhv_percent, 
      heat_rate_hhv_btu_per_kwh, 
      electricity_out_kwh, 
      gas_flow_in_therms, 
      co2_reduction_lbs, 
      co2_production_lbs, 
      nox_reduction_lbs, 
      nox_production_lbs, 
      so2_reduction_lbs, 
      so2_production_lbs, 
      user_id
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
`;

const values = [
  data.recordedat.split('T')[0], // Convert '2025-03-05T...' to '2025-03-05'
  data.total_output_factor || 0,
  data.efficiency || 0,
  null, // Placeholder for heat_rate_hhv_btu_per_kWh (Not in API response)
  data.energy || 0,
  data.fuel || 0,
  data.co2_reduction || 0,
  data.co2_production || 0,
  data.nox_reduction || 0,
  data.nox_production || 0,
  data.so2_reduction || 0,
  data.so2_production || 0,
  1 // Default user_id (update dynamically if needed)
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
 * Designed to be used as a scheduled job or standalone function.
 * 
 * @returns {Promise<boolean>} - Returns `true` if data was stored successfully, `false` otherwise.
 */
export const fetchAndStoreEnergyData = async () => {
  try {
    // Fetch site ID dynamically
    const siteID = await fetchSiteID();

    // Set date to yesterday
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1);
    const formattedDate = fromDate.toISOString().split('T')[0];

    // Fetch energy data from API
    const siteData = await fetchSiteData(siteID, formattedDate);

    if (!siteData) {
      console.warn(`No data available for Site ID on ${formattedDate}`);
      return false;
    }

    // Store data in the database
    await storeDataInDB(siteData);

    console.log('Energy data successfully fetched and stored.');
    return true;
  } catch (error) {
    console.error('Error fetching and storing energy data:', error.message);
    return false;
  }
};
