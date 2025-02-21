
import { get30DayEnergyTotals } from '../tables/table_queries.js';
import { query } from '../database_connection.js';

// Mock the query function
vi.mock('../database_connection.js', () => ({
  query: vi.fn(),
}));

describe('get30DayEnergyTotals', () => {
  it('should return the correct 30-day average energy metrics', async () => {
    const mockResult = {
      rows: [
        {
          co2_reduction_lbs: 500.5,
          co2_production_lbs: 300.3,
          nox_reduction_lbs: 50.1,
          nox_production_lbs: 20.2,
          so2_reduction_lbs: 10.0,
          so2_production_lbs: 5.5,
        },
      ],
    };

    query.mockResolvedValue(mockResult);

    const result = await get30DayEnergyTotals();

    expect(result.co2_reduction_lbs).toBe(500.5);
    expect(result.co2_production_lbs).toBe(300.3);
    expect(result.nox_reduction_lbs).toBe(50.1);
    expect(result.nox_production_lbs).toBe(20.2);
    expect(result.so2_reduction_lbs).toBe(10.0);
    expect(result.so2_production_lbs).toBe(5.5);
    expect(query).toHaveBeenCalledWith(expect.stringContaining('AVG(co2_reduction_lbs)'));
  });

  it('should handle missing rows gracefully', async () => {
    const mockResult = { rows: [] };

    query.mockResolvedValue(mockResult);

    try {
      await get30DayEnergyTotals();
    } catch (error) {
      expect(error.message).toBe('Query returned no rows.');
    }
  });

  it('should handle errors from the query function', async () => {
    const mockError = new Error('Database connection failed');

    query.mockRejectedValue(mockError);

    try {
      await get30DayEnergyTotals();
    } catch (error) {
      expect(error.message).toBe('Database connection failed');
    }
  });

  it('should return 0 for fields when the value is null', async () => {
    const mockResult = {
      rows: [
        {
          co2_reduction_lbs: null,
          co2_production_lbs: null,
          nox_reduction_lbs: null,
          nox_production_lbs: null,
          so2_reduction_lbs: null,
          so2_production_lbs: null,
        },
      ],
    };

    query.mockResolvedValue(mockResult);

    const result = await get30DayEnergyTotals();

    expect(result.co2_reduction_lbs).toBe(0);
    expect(result.co2_production_lbs).toBe(0);
    expect(result.nox_reduction_lbs).toBe(0);
    expect(result.nox_production_lbs).toBe(0);
    expect(result.so2_reduction_lbs).toBe(0);
    expect(result.so2_production_lbs).toBe(0);
  });
});
