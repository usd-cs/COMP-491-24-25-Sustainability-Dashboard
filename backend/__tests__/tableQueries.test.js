import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchBloom,
  fetchAthena,
  get30DayEnergyTotals,
  getBubbleChartData,
  getAthenaTables,
  getTreeVisualizationData,
  getCombinedWeeklyData,
  getDailyEnergyDataQuery,
  getSolarContributionsData
} from '../tables/table_queries.js';
import { query } from '../database_connection.js';

vi.mock('../database_connection.js', () => ({
  query: vi.fn()
}));

describe('table_queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchBloom', () => {
    it('returns the latest timestamp when rows exist', async () => {
      const ts = new Date().toISOString();
      query.mockResolvedValueOnce({ rows: [{ created_at: ts }] });
      const result = await fetchBloom();
      expect(result).toEqual({ timestamp: ts });
      expect(query).toHaveBeenCalledWith(expect.stringContaining('FROM energy_daily_data'));
    });

    it('returns null timestamp when no rows', async () => {
      query.mockResolvedValueOnce({ rows: [] });
      const result = await fetchBloom();
      expect(result).toEqual({ timestamp: null });
    });

    it('throws on query error', async () => {
      query.mockRejectedValueOnce(new Error('DB fail'));
      await expect(fetchBloom()).rejects.toThrow('DB fail');
    });
  });

  describe('fetchAthena', () => {
    it('returns the latest timestamp when rows exist', async () => {
      const ts = new Date().toISOString();
      query.mockResolvedValueOnce({ rows: [{ created_at: ts }] });
      const result = await fetchAthena();
      expect(result).toEqual({ timestamp: ts });
      expect(query).toHaveBeenCalledWith(expect.stringContaining('FROM athena_hourly_output'));
    });

    it('returns null timestamp when no rows', async () => {
      query.mockResolvedValueOnce({ rows: [] });
      const result = await fetchAthena();
      expect(result).toEqual({ timestamp: null });
    });

    it('throws on query error', async () => {
      query.mockRejectedValueOnce(new Error('DB down'));
      await expect(fetchAthena()).rejects.toThrow('DB down');
    });
  });

  describe('get30DayEnergyTotals', () => {
    it('parses and returns averages when data present', async () => {
      const row = {
        total_output_factor_percent: '12.34',
        ac_efficiency_lhv_percent: '56.78',
        heat_rate_hhv_btu_per_kwh: '90.12',
        electricity_out_kwh: '345.6',
        gas_flow_in_therms: '78.9',
        co2_reduction_lbs: '1.2',
        co2_production_lbs: '3.4',
        nox_reduction_lbs: '5.6',
        nox_production_lbs: '7.8',
        so2_reduction_lbs: '9.0',
        so2_production_lbs: '0.12'
      };
      query.mockResolvedValueOnce({ rows: [row] });
      const res = await get30DayEnergyTotals();
      expect(res).toEqual({
        total_output_factor_percent: 12.34,
        ac_efficiency_lhv_percent: 56.78,
        heat_rate_hhv_btu_per_kwh: 90.12,
        electricity_out_kwh: 345.6,
        gas_flow_in_therms: 78.9,
        co2_reduction_lbs: 1.2,
        co2_production_lbs: 3.4,
        nox_reduction_lbs: 5.6,
        nox_production_lbs: 7.8,
        so2_reduction_lbs: 9.0,
        so2_production_lbs: 0.12
      });
    });

    it('returns zeros when no rows', async () => {
      query.mockResolvedValueOnce({ rows: [] });
      const res = await get30DayEnergyTotals();
      expect(res).toEqual({
        total_output_factor_percent: 0,
        ac_efficiency_lhv_percent: 0,
        heat_rate_hhv_btu_per_kwh: 0,
        electricity_out_kwh: 0,
        gas_flow_in_therms: 0,
        co2_reduction_lbs: 0,
        co2_production_lbs: 0,
        nox_reduction_lbs: 0,
        nox_production_lbs: 0,
        so2_reduction_lbs: 0,
        so2_production_lbs: 0
      });
    });

    it('throws on query failure', async () => {
      query.mockRejectedValueOnce(new Error('oops'));
      await expect(get30DayEnergyTotals()).rejects.toThrow('oops');
    });
  });

  describe('getBubbleChartData', () => {
    it('maps rows to numeric fields', async () => {
      const rows = [
        { date_local: '2024-01-01', gas_flow_in_therms: '10.5', electricity_out_kwh: '20.2' },
        { date_local: '2024-01-02', gas_flow_in_therms: '0', electricity_out_kwh: '5.0' }
      ];
      query.mockResolvedValueOnce({ rows });
      const res = await getBubbleChartData();
      expect(res).toEqual([
        { date_local: '2024-01-01', gas_flow_in_therms: 10.5, electricity_out_kwh: 20.2 },
        { date_local: '2024-01-02', gas_flow_in_therms: 0, electricity_out_kwh: 5.0 }
      ]);
    });

    it('throws when no rows', async () => {
      query.mockResolvedValueOnce({ rows: [] });
      await expect(getBubbleChartData()).rejects.toThrow('No fuel-efficiency data found.');
    });

    it('throws on query error', async () => {
      query.mockRejectedValueOnce(new Error('DB error'));
      await expect(getBubbleChartData()).rejects.toThrow('DB error');
    });
  });

  describe('getAthenaTables', () => {
    it('throws on invalid buildingName', async () => {
      await expect(getAthenaTables('invalid')).rejects.toThrow('Invalid building name provided.');
    });

    it('returns parsed data for valid building', async () => {
      const sampleRow = { timestamp: 't', total_kwh: '123.456' };
      query.mockResolvedValueOnce({ rows: [sampleRow] });

      const res = await getAthenaTables('total_kwh');
      expect(res).toEqual([{ timestamp: 't', energy_output: '123.45600' }]);
    });

    it('returns empty array when no rows', async () => {
      query.mockResolvedValueOnce({ rows: [] });
      const res = await getAthenaTables('total_kwh');
      expect(res).toEqual([]);
    });
  });

  describe('getTreeVisualizationData', () => {
    it('returns default when no rows', async () => {
      query.mockResolvedValueOnce({ rows: [] });
      const res = await getTreeVisualizationData('lifetime');
      expect(res).toEqual([{ lifetime_energy: 0, period_energy: 0 }]);
    });

    it('passes through rows when present', async () => {
      const rows = [{ lifetime_energy: 100, period_energy: 20 }];
      query.mockResolvedValueOnce({ rows });
      const res = await getTreeVisualizationData('1 year');
      expect(res).toEqual(rows);
    });
  });

  describe('getCombinedWeeklyData', () => {
    it('returns mapped rows', async () => {
      const rows = [
        { week_start: '2024-01-01', total_fuelcell_kwh: '10', total_solar_kwh: '20' }
      ];
      query.mockResolvedValueOnce({ rows });
      const res = await getCombinedWeeklyData();
      expect(res).toEqual([{ week_start: '2024-01-01', total_fuelcell_kwh: 10, total_solar_kwh: 20 }]);
    });

    it('returns default when no rows', async () => {
      query.mockResolvedValueOnce({ rows: [] });
      const res = await getCombinedWeeklyData();
      expect(res).toEqual([{ week_start: null, total_fuelcell_kwh: 0, total_solar_kwh: 0 }]);
    });
  });

  describe('getDailyEnergyDataQuery', () => {
    it('formats and returns daily data', async () => {
      const weekStart = '2024-01-01';
      const rows = [
        { day_name: 'Mon', day_number: 1, solar_kwh: '5.0', fuelcell_kwh: '10.0' }
      ];
      query.mockResolvedValueOnce({ rows });
      const res = await getDailyEnergyDataQuery(weekStart);
      expect(query).toHaveBeenCalledWith(expect.any(String), [weekStart]);
      expect(res).toEqual([{ day_name: 'Mon', day_number: 1, solar_kwh: '5.00', fuelcell_kwh: '10.00' }]);
    });

    it('returns default 7 days when no rows', async () => {
      query.mockResolvedValueOnce({ rows: [] });
      const res = await getDailyEnergyDataQuery('2024-01-01');
      expect(res).toHaveLength(7);
      expect(res[0]).toHaveProperty('day_name');
    });
  });

  describe('getSolarContributionsData', () => {
    it('maps site totals', async () => {
      const rows = [
        { site: 'A', total_kwh: '100.5' },
        { site: 'B', total_kwh: null }
      ];
      query.mockResolvedValueOnce({ rows });
      const res = await getSolarContributionsData();
      expect(res).toEqual([
        { site: 'A', total_kwh: 100.5 },
        { site: 'B', total_kwh: 0 }
      ]);
    });
  });
});
