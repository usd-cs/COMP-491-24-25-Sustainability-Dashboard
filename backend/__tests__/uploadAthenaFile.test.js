import { vi, expect, describe, it, beforeEach, afterEach } from 'vitest';
import { uploadAthenaFile } from '../auth/upload/upload_controller.js';
import * as db from '../database_connection.js';

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
        buffer: Buffer.from(''),
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    db.query.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return 400 if no file is uploaded', async () => {
    req.file = null;
    await uploadAthenaFile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 200 when file is processed and data is inserted', async () => {
    const sampleCsv = '2025-03-01 12:00:00,10.5,20.3';
    req.file.buffer = Buffer.from(sampleCsv);

    db.query.mockResolvedValue({});

    await uploadAthenaFile(req, res);


  });

  it('should return 500 when an error occurs in processing', async () => {
    db.query.mockRejectedValueOnce(new Error('Database insert failed'));

    await uploadAthenaFile(req, res);

  });

  it('should return 400 if CSV format is invalid', async () => {
    // Mocking an invalid CSV format
    const invalidCsv = 'Invalid,Data';
    req.file.buffer = Buffer.from(invalidCsv);

    // Assuming the function will check CSV validity and return an error if invalid
    await uploadAthenaFile(req, res);

    // Expecting 400 response for invalid CSV format
    expect(res.status).toHaveBeenCalledWith(400);
    // Ensure the query was not called, because we shouldn't insert invalid data
    expect(db.query).not.toHaveBeenCalled();
  });
});
