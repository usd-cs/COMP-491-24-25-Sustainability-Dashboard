import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BarChart from '../components/BarChart.vue';
import axios from 'axios';
 
import * as echarts from 'echarts';

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock axios
vi.mock('axios');

// Mock echarts
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  })),
}));

describe('BarChart.vue', () => {
  let wrapper;
  const mockData = {
    total_output_factor_percent: '75.5',
    ac_efficiency_lhv_percent: '80.2',
    nox_production_lbs: '120.3',
    so2_reduction_lbs: '45.6'
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
    await flushPromises();
    await wrapper.vm.$nextTick(); // Wait for the next tick to ensure data is fetched

    // Ensure the API was called and the correct data is assigned
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/tables/getenergy');
    
     // Expected labels based on headerToDbColumnMap
     const expectedLabels = [
      'Output Factor',
      'AC Efficiency',
      'NOₓ Production',
      'SO₂ Reduction'
    ];

    // Expected data based on mockData and mapping
    const expectedData = [
      75.5,  // total_output_factor_percent
      80.2,  // ac_efficiency_lhv_percent
      120.3, // nox_production_lbs
      45.6   // so2_reduction_lbs
    ];

    expect(wrapper.vm.chartLabels).toEqual(expectedLabels);
    expect(wrapper.vm.chartData.map(Number)).toEqual(expectedData);
    expect(echarts.init).toHaveBeenCalled();
  });

  it('handles errors when fetching data', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    // Mock a failed API call
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    // Trigger the data fetch
    await wrapper.vm.fetchChartData();
    await flushPromises();

    // Wait for the next tick to ensure component has processed the error
    await wrapper.vm.$nextTick();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching chart data:', expect.any(Error));

    // Ensure chartData takes in the data from the uploaded file database 
    expect(wrapper.vm.chartData).toEqual([]);

    // Verify that chartLabels are still set to their default values
    expect(wrapper.vm.chartLabels).toEqual([
      'Output Factor',
      'AC Efficiency',
      'NOₓ Production',
      'SO₂ Reduction'
    ]);

    consoleSpy.mockRestore();
  });
});
