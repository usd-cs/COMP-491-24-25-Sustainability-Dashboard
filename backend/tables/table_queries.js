import { query } from '../database_connection.js';



/**
 * Get the most recent bloom timestamp from the energy_daily_data table.
 * @returns {Promise<Object>} The latest created_at timestamp.
 */
export const fetchBloom = async () => {
  const sqlQuery = `
    SELECT created_at 
    FROM energy_daily_data 
    ORDER BY id DESC 
    LIMIT 1;
  `;

  try {
    console.log("Executing bloom timestamp query...");

    const result = await query(sqlQuery);
    const rows = result.rows || result;

    if (!rows || rows.length === 0) {
      console.warn("No timestamp found in energy_daily_data.");
      return { timestamp: null };
    }

    const timestamp = rows[0].created_at;
    console.log("Latest bloom timestamp:", timestamp);

    return { timestamp };
  } catch (error) {
    console.error("Error fetching bloom timestamp:", error);
    throw error;
  }
};


/**
 * Get the most recent athena timestamp from the athena_hourly_output table.
 * @returns {Promise<Object>} The latest created_at timestamp.
 */
export const fetchAthena = async () => {
  const sqlQuery = `
    SELECT created_at 
    FROM athena_hourly_output
    ORDER BY id DESC 
    LIMIT 1;
  `;

  try {
    console.log("Executing athena timestamp query...");

    const result = await query(sqlQuery);
    const rows = result.rows || result;

    if (!rows || rows.length === 0) {
      console.warn("No timestamp found in athena_hourly_output.");
      return { timestamp: null };
    }

    const timestamp = rows[0].created_at;
    console.log("Latest athena timestamp:", timestamp);

    return { timestamp };
  } catch (error) {
    console.error("Error fetching athena timestamp:", error);
    throw error;
  }
};


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
 * Get daily fuel efficiency data for scatter plot.
 * @returns {Promise<Array>}
 */
export const getBubbleChartData = async () => {
  const sqlQuery = `
    SELECT
      Date_Local,
      Gas_Flow_In_Therms,
      Electricity_Out_kWh
    FROM energy_daily_data
    ORDER BY Date_Local;
  `;

  try {
    const result = await query(sqlQuery);
    const rows = result.rows || result;

    if (!rows || rows.length === 0) {
      throw new Error("No fuel-efficiency data found.");
    }

    // Map to numeric values, preserving date
    return rows.map(row => ({
      date_local: row.date_local,
      gas_flow_in_therms: parseFloat(row.gas_flow_in_therms),
      electricity_out_kwh: parseFloat(row.electricity_out_kwh)
    }));
  } catch (error) {
    console.error("Error fetching fuel efficiency data:", error);
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


/**
 * Get combined weekly energy production data from both fuel cell and solar panels.
 * Combines data from energy_daily_data (fuel cell) and athena_hourly_output (solar panels)
 * grouped by week.
 * 
 * @returns {Promise<Array>} Array of objects containing weekly totals for both sources
 */
export const getCombinedWeeklyData = async () => {
  const combinedWeeklyDataQuery = `
    SELECT
      COALESCE(fc.week_start, sp.week_start) AS week_start,
      fc.total_fuelcell_kwh,
      sp.total_solar_kwh
    FROM (
      SELECT 
        date_trunc('week', Date_Local) AS week_start,
        SUM(Electricity_Out_kWh) AS total_fuelcell_kwh
      FROM energy_daily_data
      GROUP BY week_start
    ) fc
    FULL OUTER JOIN (
      SELECT 
        date_trunc('week', timestamp) AS week_start,
        SUM(total_kwh) AS total_solar_kwh
      FROM athena_hourly_output
      GROUP BY week_start
    ) sp
    ON fc.week_start = sp.week_start
    ORDER BY week_start;
  `;

  try {
    const result = await query(combinedWeeklyDataQuery);
    const rows = result.rows || result;

    if (!rows || rows.length === 0) {
      return [{
        week_start: null,
        total_fuelcell_kwh: 0,
        total_solar_kwh: 0
      }];
    }

    return rows.map(row => ({
      week_start: row.week_start,
      total_fuelcell_kwh: row.total_fuelcell_kwh ? parseFloat(row.total_fuelcell_kwh) : 0,
      total_solar_kwh: row.total_solar_kwh ? parseFloat(row.total_solar_kwh) : 0
    }));

  } catch (error) {
    console.error("Error fetching combined weekly data:", error);
    throw error;
  }
};

/**
 * Get daily energy data for a specific week.
 * Combines data from athena_hourly_output (solar panels) and energy_daily_data (fuel cell).
 * 
 * @param {string} weekStart - The start date of the week.
 * @returns {Promise<Array>} Array of objects containing daily totals for both sources.
 */
export const getDailyEnergyDataQuery = async (weekStart) => {
  console.log('Input weekStart:', weekStart);

  const sql = `
    WITH week_dates AS (
      SELECT
        ($1::date + n)              AS day_date,
        to_char($1::date + n, 'Dy') AS day_name,
        n + 1                       AS day_number
      FROM generate_series(0, 6) n
    ),
    solar_data AS (
      SELECT
        timestamp::date        AS day,
        SUM(total_kwh)::numeric AS solar_kwh
      FROM athena_hourly_output
      WHERE timestamp::date >= $1::date
        AND timestamp::date <  ($1::date + INTERVAL '7 days')
      GROUP BY timestamp::date
    ),
    fuel_cell_data AS (
      SELECT
        date_local::date           AS day,
        SUM(electricity_out_kwh)::numeric AS fuelcell_kwh
      FROM energy_daily_data
      WHERE date_local >= $1::date
        AND date_local <  ($1::date + INTERVAL '7 days')
      GROUP BY date_local::date
    )
    SELECT
      wd.day_name,
      wd.day_number,
      COALESCE(s.solar_kwh,    0) AS solar_kwh,
      COALESCE(f.fuelcell_kwh, 0) AS fuelcell_kwh
    FROM week_dates wd
    LEFT JOIN solar_data       s ON s.day = wd.day_date
    LEFT JOIN fuel_cell_data   f ON f.day = wd.day_date
    ORDER BY wd.day_number;
  `;

  try {
    const result = await query(sql, [weekStart]);
    const rows = result.rows || result;

    console.log('Raw query result:', rows);

    // If DB returned no rows (unlikely now), fall back to zeros
    if (!rows?.length) {
      console.log('No data returned, using default values');
      return Array.from({ length: 7 }, (_, i) => ({
        day_name: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
        day_number: i + 1,
        solar_kwh: '0.00',
        fuelcell_kwh: '0.00'
      }));
    }

    // Format and return
    const processedData = rows.map(r => ({
      day_name: r.day_name,
      day_number: +r.day_number,
      solar_kwh: parseFloat(r.solar_kwh).toFixed(2),
      fuelcell_kwh: parseFloat(r.fuelcell_kwh).toFixed(2)
    }));

    console.log('Processed data:', processedData);
    return processedData;
  } catch (error) {
    console.error('Error in getDailyEnergyDataQuery:', error);
    throw error;
  }
};
