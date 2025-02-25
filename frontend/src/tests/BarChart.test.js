import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BarChart from '../components/BarChart.vue';
import axios from 'axios';
// import * as echarts from 'echarts';

// Mock axios
vi.mock('axios');

// Mock echarts
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
  })),
}));

describe('BarChart.vue', () => {
  let wrapper;
  const mockData = {
    date_local: '2023-10-01',
    heat_rate_hhv_btu_per_kwh: 10000,
    electricity_out_kwh: 5000,
    gas_flow_in_therms: 200,
    co2_reduction_lbs: 300,
    co2_production_lbs: 400,
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockData }); // Mock successful API call
    wrapper = mount(BarChart);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chart container', () => {
    expect(wrapper.find('.chart-container').exists()).toBe(true);
  });

  it('fetches chart data on mount', async () => {
    await wrapper.vm.$nextTick(); // Wait for the next tick to ensure data is fetched

    // Ensure the API was called and the correct data is assigned
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/tables/getenergy');
    expect(wrapper.vm.chartData).toEqual([10000, 5000, 200, 300, 400]);
    expect(wrapper.vm.chartLabels).toEqual([
      'Heat Rate',
      'Electricity Out',
      'Gas Flow In',
      'CO₂ Reduction',
      'CO₂ Production',
    ]);
  });

  it('handles errors when fetching data', async () => {
    // Mock a failed API call
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    // Trigger the data fetch
    await wrapper.vm.fetchChartData();

    // Wait for the next tick to ensure component has processed the error
    await wrapper.vm.$nextTick();

    // Ensure chartData takes in the data from the uploaded file database 
    expect(wrapper.vm.chartData).toEqual([10000, 5000, 200, 300, 400]);

    // Verify that chartLabels are still set to their default values
    expect(wrapper.vm.chartLabels).toEqual([
      'Heat Rate',
      'Electricity Out',
      'Gas Flow In',
      'CO₂ Reduction',
      'CO₂ Production',
    ]);
  });
});
