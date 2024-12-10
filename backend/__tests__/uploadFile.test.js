/**
 * @file uploadFile.test.js
 * @description Unit tests for the `uploadFile` function, which processes file uploads and inserts data into a database.
 * Tests include cases for no file uploads, successful processing, and error handling.
 */

import { vi, expect, describe, it, beforeEach } from 'vitest';
import XLSX from 'xlsx';
import { uploadFile } from '../auth/upload/upload_controller.js';
import * as db from '../database_connection.js'; // Use * to mock the entire module

// Mock external dependencies
vi.mock('xlsx');
vi.mock('axios');

// Mock the database module using vi.fn()
vi.mock('../database_connection.js', () => ({
  query: vi.fn(), // Mocking query function directly
}));

describe('uploadFile', () => {
  let req;
  let res;

  beforeEach(() => {
    // Initialize mock request and response objects
    req = {
      file: {
        originalname: 'test.xlsx',
        buffer: Buffer.from('mocked buffer'),
      },
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  /**
   * Test: Should return 400 if no file is uploaded.
   */
  it('should return 400 if no file is uploaded', async () => {
    req.file = null; // No file uploaded

    await uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'No file uploaded.' });
  });

  /**
   * Test: Should process the file and insert data into the database.
   */
  it('should process the file and insert data into the database', async () => {
    // Mock XLSX methods
    const mockSheetData = [
      { Header1: 1, Header2: 2, Header3: 3 },
      { Header1: 4, Header2: 5, Header3: 6 },
    ];

    XLSX.read.mockReturnValue({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: mockSheetData,
      },
    });
    XLSX.utils.sheet_to_json.mockReturnValue(mockSheetData);

    // Mock query to simulate successful DB interaction
    db.query.mockResolvedValue({}); // Mocking query directly using db.query

    await uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Data successfully uploaded and inserted into the database.',
    });
  });

  /**
   * Test: Should handle errors and return a 500 response.
   */
  it('should handle errors and return a 500 response', async () => {
    // Simulate an error during the file processing
    XLSX.read.mockImplementation(() => {
      throw new Error('Error reading file');
    });

    await uploadFile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to process and insert the uploaded file. Please check the file and try again.',
    });
  });
});
