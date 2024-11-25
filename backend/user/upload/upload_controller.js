import { query } from '../../database_connection.js';
import csv from 'csv-parser';
import { Readable } from 'stream';

// stubbed method for user csv upload
export const uploadFile = async (req, res) => {
  console.log('Request received:', req.body);
  res.status(200).json({ message: 'Upload successful' });
};