import { query } from '../../database_connection.js';
import XLSX from 'xlsx';

/**
 * Handles the file upload, processes the Excel file, and inserts the data into the database.
 *
 * This function performs the following steps:
 * 1. Checks if a file is uploaded. If not, returns a 400 status with an error message.
 * 2. Reads the uploaded Excel file using the `xlsx` library.
 * 3. Extracts the first sheet from the workbook and converts it to JSON format.
 * 4. Extracts the headers from the 11th row (zero-based index 10) and the data rows starting from the 13th row.
 * 5. Maps the Excel headers to the corresponding database columns.
 * 6. Processes each row of data, converting the "Date (Local)" column from an Excel serial number to a valid date format.
 * 7. Prepares the data for insertion into the database.
 * 8. Constructs an SQL `INSERT` query and inserts each row of data into the `public.energy_daily_data` table.
 * 9. Returns a 200 status with a success message if the data is successfully inserted into the database.
 * 10. Catches and logs any errors during the process and returns a 500 status with an error message.
 *
 * @param {Object} req - The request object, containing the uploaded file in `req.file`.
 * @param {Object} res - The response object, used to send the response back to the client.
 */
export const uploadFile = async (req, res) => {
  try {
    console.log('Request received for file upload');

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    console.log('File received:', req.file.originalname);

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const worksheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('Raw worksheet data:', worksheetData);

    const headerRowIndex = 10; // Row 11 (zero-based index is 10)
    const headers = worksheetData[headerRowIndex];
    const rows = worksheetData.slice(headerRowIndex + 2);

    console.log('Detected headers:', headers);
    console.log('Data rows count:', rows.length);

    // Map Excel headers to database columns
    const headerToDbColumnMap = {
      'Date (Local)': 'date_local',
      'Total Output Factor': 'total_output_factor_percent',
      'AC Efficiency (LHV)': 'ac_efficiency_lhv_percent',
      'Heat Rate (HHV)': 'heat_rate_hhv_btu_per_kwh',
      'Electricity Out': 'electricity_out_kwh',
      'Gas Flow In': 'gas_flow_in_therms', // One of the duplicate columns will map here
      'CO₂ Reduction': 'co2_reduction_lbs',
      'CO₂ Production': 'co2_production_lbs',
      'NOₓ Reduction': 'nox_reduction_lbs',
      'NOₓ Production': 'nox_production_lbs',
      'SO₂ Reduction': 'so2_reduction_lbs',
      'SO₂ Production': 'so2_production_lbs',
    };

    const columns = Object.values(headerToDbColumnMap); // Database columns
    console.log('Mapped database columns:', columns);

    const data = rows.map((row, rowIndex) => {
      const rowData = headers.reduce((obj, header, index) => {
        const dbColumn = headerToDbColumnMap[header];
        if (dbColumn) {
          let value = row[index];

          // Convert "Date (Local)" from Excel serial number to valid date
          if (dbColumn === 'date_local' && typeof value === 'number') {
            const jsDate = new Date((value - 25569) * 86400 * 1000); // Excel epoch offset
            value = jsDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }

          // Preserve all values (including 0 and small numbers)
          obj[dbColumn] = value !== undefined && value !== null ? value : null;

          // Debugging specific columns
          if (dbColumn === 'gas_flow_in_therms' || dbColumn === 'electricity_out_kwh') {
            console.log(`${dbColumn} (row ${rowIndex + 1}):`, obj[dbColumn]);
          }
        }
        return obj;
      }, {});
      console.log('Processed row:', rowData);
      return rowData;
    });

    console.log('Processed worksheet data:', data);

    const insertQuery = `
      INSERT INTO public.energy_daily_data (${columns.join(', ')})
      VALUES (${columns.map((_, index) => `$${index + 1}`).join(', ')})
    `;

    for (const row of data) {
      const values = columns.map(col => row[col]); // Ensure values match columns
      console.log('Prepared row for insertion:', values);

      await query(insertQuery, values);
    }

    res.status(200).json({ message: 'Data successfully uploaded and inserted into the database.' });
  } catch (error) {
    console.error('Error during file upload and processing:', error.message);
    res.status(500).json({ message: 'Failed to process and insert the uploaded file. Please check the file and try again.' });
  }
};


