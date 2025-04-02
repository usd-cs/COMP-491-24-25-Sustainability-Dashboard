import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BubbleChart from '../components/BubbleChart.vue';
import axios from 'axios';
import * as echarts from 'echarts';

// --- Mocks ---
vi.mock('axios');
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn(),
  })),
}));

// flushPromises helper to wait for all pending promises
const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('BubbleChart.vue', () => {
  let wrapper;
  // Create mock data 
  const mockData = [
    {
      nox_reduction_lbs: '100.1234',
      co2_reduction_lbs: '50.5678',
      electricity_out_kwh: '75.9123'
    },
    {
      nox_reduction_lbs: '200.9999',
      co2_reduction_lbs: '100.1234',
      electricity_out_kwh: '60.0001'
    },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockData });
    // Mount with default fullPage = false
    wrapper = mount(BubbleChart, { props: { fullPage: false } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the chart wrapper and chart container', () => {
    expect(wrapper.find('.chart-wrapper').exists()).toBe(true);
    expect(wrapper.find('.chart-container').exists()).toBe(true);
  });

  it('fetches chart data on mount', async () => {
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/tables/getbubblechart');

    expect(wrapper.vm.chartData).toEqual([
      ['100.123', '50.568', '75.912'],
      ['201.000', '100.123', '60.000'],
    ]);

    expect(echarts.init).toHaveBeenCalled();
    const chartInstance = echarts.init.mock.results[0].value;
    expect(chartInstance.setOption).toHaveBeenCalled();
  });

  it('handles errors when fetching data', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    axios.get.mockRejectedValueOnce(new Error('Network Error'));
    await wrapper.vm.fetchChartData();
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching chart data:', expect.any(Error));
    expect(wrapper.vm.chartData).toEqual([]); // Should be empty array on error
    
    consoleSpy.mockRestore();
  });

  it('respects the fullPage prop (visualMap.show is true when fullPage is true)', async () => {
    // Mount a new instance with fullPage true.
    const wrapperFull = mount(BubbleChart, { props: { fullPage: true } });
    await flushPromises();
    await wrapperFull.vm.$nextTick();

    // Retrieve the last echarts instance created.
    const results = echarts.init.mock.results;
    const chartInstance = results[results.length - 1].value;
    // Retrieve the options from the last call to setOption.
    const lastCallOption = chartInstance.setOption.mock.calls[
      chartInstance.setOption.mock.calls.length - 1
    ][0];

    expect(lastCallOption.visualMap.show).toBe(true);
  });
});
