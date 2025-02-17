import { query } from '../database_connection.js';

/**
 * Get 30-day average energy metrics for selected columns.
 * @returns {Promise<Object>}
 */
export const get30DayEnergyTotals = async () => {
  const sqlQuery = `
    SELECT 
      AVG(co2_reduction_lbs) AS co2_reduction_lbs,
      AVG(co2_production_lbs) AS co2_production_lbs,
      AVG(nox_reduction_lbs) AS nox_reduction_lbs,
      AVG(nox_production_lbs) AS nox_production_lbs,
      AVG(so2_reduction_lbs) AS so2_reduction_lbs,
      AVG(so2_production_lbs) AS so2_production_lbs
    FROM energy_daily_data
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
  `;

  try {
    const result = await query(sqlQuery);
    console.log("Full query result:", result);
    // Check if result has a 'rows' property; otherwise, assume result is an array of rows
    const rows = result.rows || result;
    
    if (!rows || rows.length === 0) {
      throw new Error("Query returned no rows.");
    }

    const row = rows[0] || {};

    return {
      co2_reduction_lbs: row.co2_reduction_lbs ? parseFloat(row.co2_reduction_lbs) : 0,
      co2_production_lbs: row.co2_production_lbs ? parseFloat(row.co2_production_lbs) : 0, 
      nox_reduction_lbs: row.nox_reduction_lbs ? parseFloat(row.nox_reduction_lbs) : 0,
      nox_production_lbs: row.nox_production_lbs ? parseFloat(row.nox_production_lbs) : 0,
      so2_reduction_lbs: row.so2_reduction_lbs ? parseFloat(row.so2_reduction_lbs) : 0,
      so2_production_lbs: row.so2_production_lbs ? parseFloat(row.so2_production_lbs) : 0
    };
  } catch (error) {
    console.error("Error fetching 30-day energy totals:", error);
    throw error;
  }
};
