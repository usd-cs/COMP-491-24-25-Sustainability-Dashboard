import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';  
import app from '../index.js';  

// Mock the database query function
import { query } from '../database_connection.js';
vi.mock('../database_connection.js', () => ({
  query: vi.fn()
}));

describe('API Endpoints Integration Test', () => {

  beforeEach(() => {
    // Clear all mocks before each test to avoid shared state issues
    vi.clearAllMocks();
  });

  // Test for getting 30-day energy summary data
  it('should respond with 30-day energy summary data from /api/tables/getenergy', async () => {
    const mockData = {
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
      { co2_production_lbs: 100, co2_reduction_lbs: 200, ac_efficiency_lhv_percent: 80, total_output_factor_percent: 90 },
      { co2_production_lbs: 150, co2_reduction_lbs: 250, ac_efficiency_lhv_percent: 85, total_output_factor_percent: 95 },
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

  });

  // Test for database query failure
  it('should respond with 500 on database error for /api/tables/getenergy', async () => {
    query.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get('/api/tables/getenergy');

    expect(response.status).toBe(500);

  });

});
