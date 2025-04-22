import { describe, it, expect, beforeEach, vi, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';

// Mock the database query function
import { query } from '../database_connection.js';
vi.mock('../database_connection.js', () => ({
  query: vi.fn()
}));

let server;

beforeAll(() => {
  // Start the app on a different port to avoid conflicts
  server = app.listen(3001);
});

afterAll((done) => {
  server.close(done);
});

describe('API Endpoints Integration Test', () => {
  beforeEach(() => {
    // Clear all mocks before each test to avoid shared state issues
    vi.clearAllMocks();
  });

  it('should respond with 30-day energy summary data from /api/tables/getenergy', async () => {
    const mockData = {
      total_output_factor_percent: 75.5,
      ac_efficiency_lhv_percent: 80.2,
      heat_rate_hhv_btu_per_kwh: 10000,
      electricity_out_kwh: 5000,
      gas_flow_in_therms: 200,
      co2_reduction_lbs: 1000,
      co2_production_lbs: 2000,
      nox_reduction_lbs: 300,
      nox_production_lbs: 400,
      so2_reduction_lbs: 500,
      so2_production_lbs: 600
    };

    // Mock the database returning one row
    query.mockResolvedValueOnce({ rows: [mockData] });

    const response = await request(app).get('/api/tables/getenergy');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  it('should respond with bubble chart data from /api/tables/getbubblechart', async () => {
    const mockBubbleChartData = [
      {
        date_local: '2024-03-26',
        gas_flow_in_therms: 100,
        electricity_out_kwh: 5000
      },
      {
        date_local: '2024-03-25',
        gas_flow_in_therms: 150,
        electricity_out_kwh: 6000
      }
    ];

    // Mock the database returning those two rows
    query.mockResolvedValueOnce({ rows: mockBubbleChartData });

    const response = await request(app).get('/api/tables/getbubblechart');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(mockBubbleChartData);
  });

  it('should respond with 200 on root path', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    // Depending on your root handler, you might return JSON or text;
    // here we just assert that the body is an object or non-empty.
    expect(response.body).toEqual(expect.any(Object));
  });

  it('should respond with 404 when no data is found on /api/tables/getenergy', async () => {
    // Simulate no rows returned
    query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/api/tables/getenergy');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'No energy data found for the last 30 days.'
    });
  });

  it('should respond with 500 on database error for /api/tables/getenergy', async () => {
    // Simulate a query failure
    query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get('/api/tables/getenergy');
    expect(response.status).toBe(500);
  });
});
