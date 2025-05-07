import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PieChart from '@/components/PieChart.vue';
import axios from 'axios';
import * as echarts from 'echarts';

// --- Mocks ---
vi.mock('axios');
vi.mock('echarts', () => ({ init: vi.fn() }));

const flushPromises = () => new Promise(r => setTimeout(r, 0));

describe('PieChart.vue', () => {
  let mockChart;

  const fakeData = [
    { site: 'Array A', total_kwh: 123.4567 },
    { site: 'Array B', total_kwh:  78.9123 },
    { site: 'Array C', total_kwh:  50.0000 }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue({ data: fakeData });
    mockChart = { setOption: vi.fn(), resize: vi.fn(), dispose: vi.fn() };
    echarts.init.mockReturnValue(mockChart);
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the pie chart with proper legend splitting and data', async () => {
    const wrapper = mount(PieChart);
    await flushPromises();

    expect(echarts.init).toHaveBeenCalledWith(wrapper.vm.$refs.chart);

    const opts = mockChart.setOption.mock.calls[0][0];

    // Test title
    expect(opts.title.text).toBe('Solar Energy Contributions by Site');

    // Test legend splitting
    const names = fakeData.map(i => i.site);
    const mid = Math.ceil(names.length / 2);
    expect(opts.legend[0].data).toEqual(names.slice(0, mid));
    expect(opts.legend[1].data).toEqual(names.slice(mid));

    // Test series data
    expect(opts.series[0].data).toEqual(wrapper.vm.chartData);

    // Test tooltip formatter function
    const mockParams = {
      name: 'Array A',
      value: 123.46,
      percent: '45.2'
    };
    const expectedTooltip = `Array A\nEnergy: 123.46 kWh (45.2%)\nSolar Panels: N/A`;
    const formattedTooltip = opts.tooltip.formatter(mockParams).replace(/<br\/>/g, '\n');
    expect(formattedTooltip).toBe(expectedTooltip);
  });

  it('fetches data and transforms chartData correctly', async () => {
    const wrapper = mount(PieChart);
    await flushPromises();

    const apiUrl = import.meta.env.VITE_API_URL;
    // correct API endpoint
    expect(axios.get).toHaveBeenCalledWith(
      `${apiUrl}api/tables/energy/solar/contributions`
    );

    // chartData should have name & value (rounded to 2 decimals)
    expect(wrapper.vm.chartData).toEqual([
      { name: 'Array A', value: 123.46 },
      { name: 'Array B', value:  78.91 },
      { name: 'Array C', value:  50.00 }
    ]);
  });

  it('adds and removes resize listener', () => {
    const wrapper = mount(PieChart);
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Network fail'));

    const wrapper = mount(PieChart);
    await flushPromises();

    // no crash, chartData remains empty
    expect(wrapper.vm.chartData).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching solar contributions:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
