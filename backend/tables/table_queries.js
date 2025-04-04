import { query } from '../database_connection.js';

/**
 * Get 30-day average energy metrics for selected columns.
 * @returns {Promise<Object>}
 */
export const get30DayEnergyTotals = async () => {
  const sqlQuery = `
    SELECT 
      AVG(total_output_factor_percent) AS total_output_factor_percent,
      AVG(ac_efficiency_lhv_percent) AS ac_efficiency_lhv_percent,
      AVG(heat_rate_hhv_btu_per_kwh) AS heat_rate_hhv_btu_per_kwh,
      AVG(electricity_out_kwh) AS electricity_out_kwh,
      AVG(gas_flow_in_therms) AS gas_flow_in_therms,
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
    const rows = result.rows || result;

    // Create default response object
    const defaultResponse = {
      total_output_factor_percent: 0,
      ac_efficiency_lhv_percent: 0,
      heat_rate_hhv_btu_per_kwh: 0,
      electricity_out_kwh: 0,
      gas_flow_in_therms: 0,
      co2_reduction_lbs: 0,
      co2_production_lbs: 0,
      nox_reduction_lbs: 0,
      nox_production_lbs: 0,
      so2_reduction_lbs: 0,
      so2_production_lbs: 0
    };
    
    if (!rows || rows.length === 0) {
      return defaultResponse;
    }

    const row = rows[0] || {};

    return {
      total_output_factor_percent: row.total_output_factor_percent ? parseFloat(row.total_output_factor_percent) : 0,
      ac_efficiency_lhv_percent: row.ac_efficiency_lhv_percent ? parseFloat(row.ac_efficiency_lhv_percent) : 0,
      heat_rate_hhv_btu_per_kwh: row.heat_rate_hhv_btu_per_kwh ? parseFloat(row.heat_rate_hhv_btu_per_kwh) : 0,
      electricity_out_kwh: row.electricity_out_kwh ? parseFloat(row.electricity_out_kwh) : 0,
      gas_flow_in_therms: row.gas_flow_in_therms ? parseFloat(row.gas_flow_in_therms) : 0,
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

/**
 * Get all records for Electricity_Out_kWh, Total_Output_Factor_Percent, and Gas_Flow_In_MMBtu.
 * @returns {Promise<Array>}
 */
export const getBubbleChartData = async () => {
  const sqlQuery = `
    SELECT 
      AVG(nox_reduction_lbs) as nox_reduction_lbs,
      AVG(co2_reduction_lbs) as co2_reduction_lbs,
      AVG(electricity_out_kwh) as electricity_out_kwh,
      date_local
    FROM energy_daily_data
    WHERE nox_reduction_lbs IS NOT NULL 
      AND co2_reduction_lbs IS NOT NULL 
      AND electricity_out_kwh IS NOT NULL
    GROUP BY date_local
    ORDER BY date_local DESC;
  `;

  try {
    const result = await query(sqlQuery);
    console.log("Full query result:", result);
    // Check if result has a 'rows' property; otherwise, assume result is an array of rows
    const rows = result.rows || result;
    
    if (!rows || rows.length === 0) {
      throw new Error("Query returned no rows.");
    }

    return rows.map(row => ({
      nox_reduction_lbs: row.nox_reduction_lbs ? parseFloat(row.nox_reduction_lbs) : 0,
      co2_reduction_lbs: row.co2_reduction_lbs ? parseFloat(row.co2_reduction_lbs) : 0,
      electricity_out_kwh: row.electricity_out_kwh ? parseFloat(row.electricity_out_kwh) : 0,
      date_local: row.date_local
    }));
  } catch (error) {
    console.error("Error fetching bubble chart data:", error);
    throw error;
  }
};



/**
 * Get Athena hourly energy data with optional filtering by date range.
 * @param {string|null} startTime - Start timestamp (YYYY-MM-DD HH:MM:SS) or null for no filtering.
 * @param {string|null} endTime - End timestamp (YYYY-MM-DD HH:MM:SS) or null for no filtering.
 * @returns {Promise<Array>}
 */export const getAthenaHourlyData = async (startTime = null, endTime = null) => {
  const sqlQuery = `
  SELECT * FROM get_athena_data($1, $2);
`;

try {
  const result = await query(sqlQuery, [startTime, endTime]);
  console.log("Athena data query result:", result);
  const rows = result.rows || result;  // Ensure the rows are retrieved correctly
  
  if (!rows || rows.length === 0) {
    console.warn("No data returned from Athena query.");
  }

  return rows.map(row => ({
    timestamp: row.timestamp,
    alcala_borrego: row.alcala_borrego ? parseFloat(row.alcala_borrego) : 0,
    alcala_laguna: row.alcala_laguna ? parseFloat(row.alcala_laguna) : 0,
    camino_hall: row.camino_hall ? parseFloat(row.camino_hall) : 0,
    copley_library: row.copley_library ? parseFloat(row.copley_library) : 0,
    founders_hall: row.founders_hall ? parseFloat(row.founders_hall) : 0,
    jenny_craig_pavilion: row.jenny_craig_pavilion ? parseFloat(row.jenny_craig_pavilion) : 0,
    kroc: row.kroc ? parseFloat(row.kroc) : 0,
    manchester_a: row.manchester_a ? parseFloat(row.manchester_a) : 0,
    manchester_b: row.manchester_b ? parseFloat(row.manchester_b) : 0,
    soles: row.soles ? parseFloat(row.soles) : 0,
    west_parking: row.west_parking ? parseFloat(row.west_parking) : 0,
    total_kwh: row.total_kwh ? parseFloat(row.total_kwh) : 0
  }));
} catch (error) {
  console.error("Error fetching Athena hourly data:", error.message);
  console.error("Stack Trace:", error.stack);
  throw error;  // Rethrow to handle it at a higher level if necessary
}
};
