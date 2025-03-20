import { query } from '../../database_connection.js';
import XLSX from 'xlsx';
import csvParser from 'csv-parser';     // Used for CSV parsing
import { Readable } from 'stream';      // Used to convert file buffer to a stream

/**
 * Handles the Excel file upload, processes the Excel file, and inserts the data into the database.
 *
 * (Existing method – see your current implementation)
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

/**
 * Handles the Athena CSV file upload, processes the file, sums the site kWh values for each timestamp,
 * and inserts the aggregated data into the database.
 *
 * Specifics for this Athena CSV file:
 * - The header row is on row 5 (index 4).
 * - The first row of data is on row 8 (index 7).
 * - The "Timestamp" column holds the timestamp (id).
 * - All other columns contain kWh values from various sites.
 *
 * @param {Object} req - The request object, containing the uploaded CSV file in `req.file`.
 * @param {Object} res - The response object, used to send the response back to the client.
 */
export const uploadAthenaFile = async (req, res) => {
  try {
    console.log('Request received for Athena file upload');

    if (!req.file) {
      return res.status(400).json({ message: 'No Athena file uploaded.' });
    }
    console.log('Athena file received:', req.file.originalname);

    // Convert the file buffer into a readable stream.
    const stream = Readable.from(req.file.buffer);
    const rows = [];

    // Use csv-parser in no-header mode to get each row as an array.
    stream
      .pipe(csvParser({ headers: false }))
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', async () => {
        console.log('Parsed Athena rows:', rows);

        // Validate that the file has enough rows.
        if (rows.length < 8) {
          return res.status(400).json({ message: 'Athena file does not contain enough rows.' });
        }

        // Extract the header row (row 5, index 4).
        const headerRow = rows[4];
        console.log('Detected Athena headers:', headerRow);

        // Data rows start from row 8 (index 7).
        const dataRows = rows.slice(7);
        console.log('Data rows count:', dataRows.length);

        // Map each data row (an array) to an object using headerRow as keys.
        const parsedData = dataRows.map((row) => {
          const obj = {};
          headerRow.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
        console.log('Mapped Athena data:', parsedData);

        // Process each row:
        // Sum all kWh values (all columns except the timestamp column "id").
        const processedData = parsedData.map((row, rowIndex) => {
          const timestamp = row['Timestamp'];
          let totalKwh = 0;

          // Iterate through each property in the row.
          for (const key in row) {
            if (key === 'Timestamp') continue; // Skip the timestamp column
            // Convert the value to a float; if it's not a number, use 0.
            const value = parseFloat(row[key]) || 0;
            totalKwh += value;
          }

          console.log(`Row ${rowIndex + 1}: Timestamp=${timestamp}, Total kWh=${totalKwh}`);
          return { timestamp, totalKwh };
        });
        console.log('Processed summed data:', processedData);

        // Construct an SQL INSERT query.
        const insertQuery = `
          INSERT INTO public.athena_hourly_output (timestamp, total_kwh)
          VALUES ($1, $2)
        `;

        // Insert each processed row into the database.
        for (const row of processedData) {
          const values = [row.timestamp, row.totalKwh];
          console.log('Prepared row for insertion:', values);
          await query(insertQuery, values);
        }

        res.status(200).json({ message: 'Athena data successfully processed and inserted into the database.' });
      })
      .on('error', (err) => {
        console.error('Error parsing Athena:', err.message);
        res.status(500).json({ message: 'Failed to parse Athena file.', error: err.message });
      });
  } catch (error) {
    console.error('Error during Athena file processing:', error.message);
    res.status(500).json({ message: 'Failed to process Athena file. Please check the file and try again.' });
  }
};
