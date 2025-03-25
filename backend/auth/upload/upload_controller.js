import { query } from '../../database_connection.js';
import XLSX from 'xlsx';
import csvParser from 'csv-parser';     // Used for CSV parsing
import { Readable } from 'stream';      // Used to convert file buffer to a stream

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

/**
 * Handles the Athena CSV file upload, processes the file, and inserts the data into the database.
 * 
 * - The header row is on row 5 (index 4).
 * - The first row of data is on row 8 (index 7).
 * - The raw CSV has headers like "Timestamp", "University of San Diego - Alcala Borrego", etc.
 * - We map those headers to simpler column names like "timestamp", "alcala_borrego", etc.
 * - We also compute a new column "total_kwh" that sums all numeric site columns.
 * - If a row has a valid timestamp but all kWh site columns are empty, we skip that row entirely.
 *
 * NOTE: Ensure "athena_hourly_output" table has columns matching the mapped names plus "total_kwh".
 *
 * @param {Object} req - The request object, containing the uploaded CSV file in `req.file`.
 * @param {Object} res - The response object, used to send the response back to the client.
 */
export const uploadAthenaFile = async (req, res) => {
  // Wrap the processing in a Promise so tests can await completion.
  return new Promise((resolve, reject) => {
    try {
      console.log('Request received for Athena file upload');

      if (!req.file) {
        res.status(400).json({ message: 'No Athena file uploaded.' });
        return resolve();
      }
      console.log('Athena file received:', req.file.originalname);

      // Convert file buffer into a readable stream.
      const stream = Readable.from(req.file.buffer);
      const rows = [];

      stream
        .pipe(csvParser({ headers: false }))
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', async () => {
          console.log('Parsed Athena rows:', rows);

          if (rows.length < 8) {
            res.status(400).json({ message: 'Athena file does not contain enough rows.' });
            return resolve();
          }

          // Extract header row from row 5 (index 4).
          const headerRowRaw = rows[4];
          const headerRow = Array.isArray(headerRowRaw)
            ? headerRowRaw
            : Object.values(headerRowRaw);
          console.log('Detected Athena headers:', headerRow);

          // Data rows start from row 8 (index 7 onward).
          const dataRows = rows.slice(7);
          console.log('Data rows count:', dataRows.length);

          // Define a map from raw CSV headers to our database table column names.
          const headerMap = {
            'Timestamp': 'timestamp',
            'University of San Diego - Alcala Borrego': 'alcala_borrego',
            'University of San Diego - Alcala Laguna': 'alcala_laguna',
            'University of San Diego - Camino Hall': 'camino_hall',
            'University of San Diego - Copley Library': 'copley_library',
            'University of San Diego - Founders Hall': 'founders_hall',
            'University of San Diego - Jenny Craig Pavillion': 'jenny_craig_pavilion',
            'University of San Diego - Kroc': 'kroc',
            'University of San Diego - Manchester A': 'manchester_a',
            'University of San Diego - Manchester B': 'manchester_b',
            'University of San Diego - Soles': 'soles',
            'University of San Diego - West Parking': 'west_parking'
          };

          // Map each data row (array) into an object using the header row as keys.
          let parsedData = dataRows.map((row) => {
            const obj = {};
            headerRow.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          console.log('Mapped Athena data (raw headers):', parsedData);

          // Filter out any rows with an empty or missing Timestamp.
          parsedData = parsedData.filter((row) => {
            const ts = row['Timestamp'];
            return ts !== undefined && ts !== null && ts.toString().trim() !== '';
          });
          console.log('Filtered Athena data (non-empty Timestamp):', parsedData);

          // Next, filter out rows where Timestamp is present,
          // but all site columns are empty.
          const siteHeaders = Object.keys(headerMap).filter(h => h !== 'Timestamp');
          parsedData = parsedData.filter((row) => {
            // If *every* site header is empty, skip the row.
            // "Empty" means undefined, null, or empty string (once trimmed).
            const allEmpty = siteHeaders.every((h) => {
              const val = row[h];
              return val === undefined || val === null || val.toString().trim() === '';
            });
            return !allEmpty;
          });
          console.log('Filtered Athena data (non-empty site columns):', parsedData);

          // Transform each row to use the mapped column names and compute total_kwh.
          const processedData = parsedData.map((row, rowIndex) => {
            const processedRow = {};
            let totalKwh = 0;

            // Helper function to trim trailing zeros
            const trimTrailingZeros = (num) => {
              if (num === null || isNaN(num)) return null;
              return Number(parseFloat(num).toString());
            };

            // Iterate over each raw header in the row
            for (const rawHeader in row) {
              const mappedCol = headerMap[rawHeader];
              if (!mappedCol) {
                console.warn(`Skipping unmapped header: ${rawHeader}`);
                continue;
              }
              if (mappedCol === 'timestamp') {
                processedRow[mappedCol] = row[rawHeader];
              } else {
                // Parse float and trim trailing zeros
                const num = parseFloat(row[rawHeader]);
                processedRow[mappedCol] = trimTrailingZeros(num);
                totalKwh += isNaN(num) ? 0 : num;
              }
            }
            // Trim trailing zeros from total while maintaining precision
            processedRow['total_kwh'] = trimTrailingZeros(totalKwh);
            console.log(`Row ${rowIndex + 1} processed:`, processedRow);
            return processedRow;
          });
          console.log('Processed Athena data with mapped columns and total_kwh:', processedData);

          // Build an array of final column names (order matters).
          const tableColumns = headerRow.map(header =>
            header === 'Timestamp' ? 'timestamp' : headerMap[header]
          );
          tableColumns.push('total_kwh');
          console.log('Table columns for insertion:', tableColumns);

          // Construct the dynamic INSERT query.
          const insertQuery = `
            INSERT INTO public.athena_hourly_output (${tableColumns.join(', ')})
            VALUES (${tableColumns.map((_, index) => `$${index + 1}`).join(', ')})
          `;
          console.log('Insert query:', insertQuery);

          // Insert each processed row into the database.
          for (const row of processedData) {
            const values = tableColumns.map(col => row[col]);
            console.log('Prepared row for insertion:', values);
            await query(insertQuery, values);
          }

          res.status(200).json({ message: 'Athena data successfully processed and inserted into the database.' });
          resolve();
        })
        .on('error', (err) => {
          console.error('Error parsing Athena:', err.message);
          res.status(500).json({ message: 'Failed to parse Athena file.', error: err.message });
          reject(err);
        });
    } catch (error) {
      console.error('Error during Athena file processing:', error.message);
      res.status(500).json({ message: 'Failed to process Athena file. Please check the file and try again.' });
      reject(error);
    }
  });
};
