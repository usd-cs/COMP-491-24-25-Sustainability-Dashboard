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


/* Fetch the data from the Athena Table */
export const getAthenaTables = async (buildingName) => {
  const validColumns = [
    "alcala_borrego",
    "alcala_laguna",
    "camino_hall",
    "copley_library",
    "founders_hall",
    "jenny_craig_pavilion",
    "kroc",
    "manchester_a",
    "manchester_b",
    "soles",
    "west_parking",
    "total_kwh"
  ];

  // Validate the buildingName
  if (!validColumns.includes(buildingName)) {
    throw new Error("Invalid building name provided.");
  }

  // Construct the SQL query dynamically
  // Query the Athena table for the last 24 hours for a specific building
  const sqlQuery = `
    SELECT timestamp, ${buildingName}
    FROM athena_hourly_output
    WHERE timestamp >= NOW() - INTERVAL '24 hours'
    ORDER BY timestamp DESC; -- Sort by timestamp in descending order
  `;

  try {
    const result = await query(sqlQuery);
    const rows = result.rows || result;

    if (!rows || rows.length === 0) {
      console.warn(`No data found for building: ${buildingName} in the last 24 hours.`);
      return [];
    }

    // Ensure you handle the dynamic column name correctly in the mapping
    /* Succesfull query result:
      [
        { timestamp: '2025-04-03T12:00:00Z', energy_output: '123.45678' },
        { timestamp: '2025-04-03T13:00:00Z', energy_output: '234.56789' },
        ...
      ]
    */
    return rows.map(row => ({
      timestamp: row.timestamp, // Ensure timestamp is in the correct format
      column: parseFloat(row[column]).toFixed(5)
    }));
  } catch (error) {
    console.error('Error fetching Athena data for building: ${buildingName}', error);
    throw error;
  }
};
