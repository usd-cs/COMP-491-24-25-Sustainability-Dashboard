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
  // Use a different port for testing
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

  // Test for getting 30-day energy summary data
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
      so2_production_lbs: 600,
    };

    // Mock the query response
    query.mockResolvedValueOnce({ rows: [mockData] });

    const response = await request(app).get('/api/tables/getenergy');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockData);
  });

  // Test for getting bubble chart data
  it('should respond with bubble chart data from /api/tables/getbubblechart', async () => {
    const mockBubbleChartData = [
      {
        nox_reduction_lbs: 100,
        co2_reduction_lbs: 200,
        electricity_out_kwh: 5000,
        date_local: '2024-03-26'
      },
      {
        nox_reduction_lbs: 150,
        co2_reduction_lbs: 250,
        electricity_out_kwh: 6000,
        date_local: '2024-03-25'
      }
    ];

    query.mockResolvedValueOnce({ rows: mockBubbleChartData });

    const response = await request(app).get('/api/tables/getbubblechart');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(mockBubbleChartData);
  });

  // Test for root route response
  it('should respond with 200 on root path', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    
    // Ensure it correctly handles text or JSON response
    expect(response.body).toEqual(expect.any(Object));
  });

  // Test for when database query returns no data
  it('should respond with 404 when no data is found on /api/tables/getenergy', async () => {
    query.mockResolvedValueOnce({ rows: [] });
    const response = await request(app).get('/api/tables/getenergy');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
        message: 'No energy data found for the last 30 days.'
    });
  });

  // Test for database query failure
  it('should respond with 500 on database error for /api/tables/getenergy', async () => {
    query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get('/api/tables/getenergy');

    expect(response.status).toBe(500);

  });

});
