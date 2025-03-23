import { fetchAndStoreEnergyData } from '../auth/upload/fetchApiData.js';
import axios from 'axios';
import dotenv from 'dotenv';
import { beforeEach, describe, it, vi, expect } from 'vitest';


dotenv.config();

// Mock axios
vi.mock('axios');

// Mock database query function
vi.mock('../../database_connection.js', () => ({
  query: vi.fn(),
}));

describe('fetchAndStoreEnergyData', () => {

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should fetch and store energy data successfully', async () => {
    // Mock successful token retrieval
    axios.post.mockResolvedValueOnce({ data: { token: 'fake-token' } });

    // Mock fetching site ID
    axios.get.mockResolvedValueOnce({ data: [{ id: 'site-123' }] });

    // Mock fetching site data
    axios.post.mockResolvedValueOnce({
      data: {
        data: [{
          recordedat: '2025-03-05T00:00:00Z',
          total_output_factor: 90,
          efficiency: 85,
          energy: 1000,
          fuel: 500,
          co2_reduction: 100,
          co2_production: 200,
          nox_reduction: 30,
          nox_production: 40,
          so2_reduction: 20,
          so2_production: 10,
        }],
      },
    });

    // Call the function
    const result = await fetchAndStoreEnergyData();

    // Assertions
    expect(result).toBe(true);
    expect(axios.post).toHaveBeenCalledTimes(2); // Token, Site ID, Site Data
    expect(axios.get).toHaveBeenCalledTimes(1); // Site ID fetch
    
  });

  it('should handle errors in fetching data (token fetch failure)', async () => {
    // Mock token fetch failure
    axios.post.mockRejectedValueOnce(new Error('Authentication failed'));

  });

  it('should handle missing site data gracefully', async () => {
    // Mock successful token retrieval
    axios.post.mockResolvedValueOnce({ data: { token: 'fake-token' } });

    // Mock fetching site ID
    axios.get.mockResolvedValueOnce({ data: [{ id: 'site-123' }] });

    // Mock site data fetch returning null data
    axios.post.mockResolvedValueOnce({
      data: { data: [] },
    });

    const result = await fetchAndStoreEnergyData();

    expect(result).toBe(false);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledTimes(1); // Site ID fetch
  });

  it('should handle database insertion failure', async () => {
    // Mock successful token retrieval
    axios.post.mockResolvedValueOnce({ data: { token: 'fake-token' } });

    // Mock fetching site ID
    axios.get.mockResolvedValueOnce({ data: [{ id: 'site-123' }] });

    // Mock site data fetch
    axios.post.mockResolvedValueOnce({
      data: {
        data: [{
          recordedat: '2025-03-05T00:00:00Z',
          total_output_factor: 90,
          efficiency: 85,
          energy: 1000,
          fuel: 500,
          co2_reduction: 100,
          co2_production: 200,
          nox_reduction: 30,
          nox_production: 40,
          so2_reduction: 20,
          so2_production: 10,
        }],
      },
    });


    const result = await fetchAndStoreEnergyData();

    expect(result).toBe(false);
    expect(axios.post).toHaveBeenCalledTimes(1); 
    expect(axios.get).toHaveBeenCalledTimes(1); // Site ID fetch
  });
});
