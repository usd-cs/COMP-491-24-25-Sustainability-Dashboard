import { query } from '../database_connection.js';

/**
 * Get 30-day total energy metrics with date range.
 * @returns {Promise<Object>}
 */
export const get30DayEnergyTotals = async () => {
    const sqlQuery = `
        SELECT 
            SUM(Heat_Rate_HHV_BTU_per_kWh) AS Total_Heat_Rate_HHV_BTU_per_kWh,
            SUM(Electricity_Out_kWh) AS Total_Electricity_Out_kWh, 
            SUM(CO2_Reduction_lbs) AS Total_CO2_Reduction_lbs, 
            SUM(CO2_Production_lbs) AS Total_CO2_Production_lbs, 
            SUM(Gas_Flow_In_Therms) AS Total_Gas_Flow_In_Therms,
            CONCAT(
                TO_CHAR(MIN(Date_Local), 'YYYY-MM-DD'), 
                ' - ', 
                TO_CHAR(MAX(Date_Local), 'YYYY-MM-DD')
            ) AS Date_Range
        FROM energy_30_day_totals;
    `;

    try {
        const result = await query(sqlQuery);
        return result.rows[0];
    } catch (error) {
        console.error("Error fetching 30-day energy totals:", error);
        throw error;
    }
};
