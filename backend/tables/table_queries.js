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
  WHERE ${buildingName} IS NOT NULL
  ORDER BY timestamp DESC
  LIMIT 24; -- Retrieve the most recent 24 entries
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
      timestamp: row.timestamp,
      energy_output: parseFloat(row[buildingName]).toFixed(5)
    }));
  } catch (error) {
    console.error('Error fetching Athena data for building: ${buildingName}', error);
    throw error;
  }
};

/**
 * Get tree visualization data for a given time period.
 * The period parameter can be: "week", "month", "6 months", "1 year", or "lifetime".
 * For periods other than "lifetime", we filter the data based on the actual date columns:
 * - For athena_hourly_output, we filter on the timestamp column.
 * - For energy_daily_data, we filter on the date_local column.
 *
 * @param {string} period - The selected timeframe.
 * @returns {Promise<Array>}
 */
export const getTreeVisualizationData = async (period) => {
  let interval = "";
  if (period && period.toLowerCase() !== "lifetime") {
    switch (period.toLowerCase()) {
      case "1 week":
        interval = "7 days";
        break;
      case "1 month":
        interval = "30 days";
        break;
      case "3 months":
        interval = "90 days";
        break;
      case "6 months":
        interval = "180 days";
        break;
      case "1 year":
        interval = "1 year";
        break;
      default:
        interval = "30 days"; // default is 1 month
    }
  }
  
  const periodEnergyQuery =
    (period && period.toLowerCase() !== "lifetime")
      ? `
      (
        COALESCE(
          (SELECT SUM(total_kwh) FROM athena_hourly_output WHERE timestamp >= CURRENT_DATE - INTERVAL '${interval}'),
          0::numeric
        ) +
        COALESCE(
          (SELECT SUM(electricity_out_kwh) FROM energy_daily_data WHERE date_local >= CURRENT_DATE - INTERVAL '${interval}'),
          0::numeric
        )
      ) AS period_energy
      `
      : `
      (
        COALESCE((SELECT SUM(total_kwh) FROM athena_hourly_output), 0::numeric) +
        COALESCE((SELECT SUM(electricity_out_kwh) FROM energy_daily_data), 0::numeric)
      ) AS period_energy
      `;
      
  const sqlQuery = `
    SELECT 
      (
        COALESCE((SELECT SUM(total_kwh) FROM athena_hourly_output), 0::numeric) +
        COALESCE((SELECT SUM(electricity_out_kwh) FROM energy_daily_data), 0::numeric)
      ) AS lifetime_energy,
      ${periodEnergyQuery}
  `;

  try {
    const result = await query(sqlQuery);
    // Support both the object and array return cases
    const rows = result.rows || result;
    console.log("Tree visualization data:", rows);
    
    if (!rows || rows.length === 0) {
      return [{
        lifetime_energy: 0,
        period_energy: 0
      }];
    }
    
    return rows;
  } catch (error) {
    console.error("Error fetching tree visualization data:", error);
    throw error;
  }
};
