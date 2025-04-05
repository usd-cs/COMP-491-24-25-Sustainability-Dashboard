/**
 * @file uploadAthenaFile.test.js
 * @description Unit tests for the `uploadAthenaFile` function.
 */

import { vi, expect, describe, it, beforeEach } from 'vitest';
import { Readable } from 'stream';
import { uploadAthenaFile } from '../auth/upload/upload_controller.js';
import * as db from '../database_connection.js';

// Mock the database module's query function.
vi.mock('../database_connection.js', () => ({
  query: vi.fn(),
}));

describe('uploadAthenaFile', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      file: {
        originalname: 'test-athena.csv',
        buffer: Buffer.from('') // We'll set the content per test.
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Clear previous calls to db.query.
    db.query.mockClear();
  });

  it('should return 400 if no file is uploaded', async () => {
    req.file = null;
    await uploadAthenaFile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No Athena file uploaded.' });
  });

  it('should process the file and insert data into the database with correct values', async () => {
    const sampleCsv = [
      'dummy1',    // row 0
      'dummy2',    // row 1
      'dummy3',    // row 2
      'dummy4',    // row 3
      // row 4: header row
      'Timestamp,University of San Diego - Alcala Borrego,University of San Diego - Alcala Laguna,University of San Diego - Camino Hall,University of San Diego - Copley Library,University of San Diego - Founders Hall,University of San Diego - Jenny Craig Pavillion,University of San Diego - Kroc,University of San Diego - Manchester A,University of San Diego - Manchester B,University of San Diego - Soles,University of San Diego - West Parking',
      'dummy6',    // row 5
      'dummy7',    // row 6
      // row 7: data row 1
      '2025-03-01 12:00:00,10.5,20.3,15.0,12.2,13.3,9.8,11.1,10.0,8.5,14.0,7.6',
      // row 8: data row 2
      '2025-03-01 13:00:00,11.0,19.8,15.5,12.0,13.8,10.0,11.2,10.1,8.6,14.2,7.7'
    ].join('\n');

    req.file.buffer = Buffer.from(sampleCsv);

    // Expected values for row 1 (note total_kwh rounded to one decimal: 132.3).
    const expectedRow1 = [
      '2025-03-01 12:00:00', // timestamp
      10.5,  // alcala_borrego
      20.3,  // alcala_laguna
      15.0,  // camino_hall
      12.2,  // copley_library
      13.3,  // founders_hall
      9.8,   // jenny_craig_pavilion
      11.1,  // kroc
      10.0,  // manchester_a
      8.5,   // manchester_b
      14.0,  // soles
      7.6,   // west_parking
      132.3  // total_kwh
    ];

    // Expected values for row 2.
    const expectedRow2 = [
      '2025-03-01 13:00:00', // timestamp
      11.0,  // alcala_borrego
      19.8,  // alcala_laguna
      15.5,  // camino_hall
      12.0,  // copley_library
      13.8,  // founders_hall
      10.0,  // jenny_craig_pavilion
      11.2,  // kroc
      10.1,  // manchester_a
      8.6,   // manchester_b
      14.2,  // soles
      7.7,   // west_parking
      133.9  // total_kwh
    ];

    // Mock db.query to simulate successful insertion.
    db.query.mockResolvedValue({});

    await uploadAthenaFile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Athena data successfully processed and inserted into the database.'
    });

    // Expect two insert calls (one per data row).
    expect(db.query).toHaveBeenCalledTimes(3);

    const firstCallValues = db.query.mock.calls[0][1];
    const secondCallValues = db.query.mock.calls[1][1];

    expect(firstCallValues).toEqual(expectedRow1);
    expect(secondCallValues).toEqual(expectedRow2);
  });

  it('should handle errors and return a 500 response', async () => {
    // Override Readable.from to throw an error.
    vi.spyOn(Readable, 'from').mockImplementation(() => {
      throw new Error('Test error');
    });

    await expect(uploadAthenaFile(req, res)).rejects.toThrow('Test error');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to process Athena file. Please check the file and try again.'
    });

    vi.restoreAllMocks();
  });
});
