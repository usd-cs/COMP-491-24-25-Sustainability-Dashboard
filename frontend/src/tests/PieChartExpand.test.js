import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PieChartWithAccordion from '@/components/PieChartExpand.vue';
import axios from 'axios';
import * as echarts from 'echarts';

// --- Mocks ---
vi.mock('axios');
vi.mock('echarts', () => ({ init: vi.fn() }));

const flushPromises = () => new Promise(r => setTimeout(r, 0));

describe('PieChartWithAccordion.vue', () => {
  let mockChart;
  const fakeData = [
    { site: 'Array A', total_kwh: 100 },
    { site: 'Array B', total_kwh: 300 },
    { site: 'Array C', total_kwh: 600 }
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

  it('fetches data, calculates percent & renders chart', async () => {
    const push = vi.fn();
    const wrapper = mount(PieChartWithAccordion, {
      global: { mocks: { $router: { push } } }
    });
    await flushPromises();

    // chartData has name, value, percent (string), unit
    const total = fakeData.reduce((s, i) => s + i.total_kwh, 0);
    const expected = fakeData.map(i => ({
      name: i.site,
      value: parseFloat(i.total_kwh.toFixed(2)),
      percent: ((i.total_kwh / total) * 100).toFixed(2),
      unit: 'kWh'
    }));
    expect(wrapper.vm.chartData).toEqual(expected);

    // echarts.init & setOption
    expect(echarts.init).toHaveBeenCalledWith(wrapper.vm.$refs.chart);
    const opts = mockChart.setOption.mock.calls[0][0];
    expect(opts.series[0].data).toEqual(expected);

    // legend split
    const names = expected.map(i => i.name);
    const mid = Math.ceil(names.length / 2);
    expect(opts.legend[0].data).toEqual(names.slice(0, mid));
    expect(opts.legend[1].data).toEqual(names.slice(mid));
  });

  it('navigateBack pushes to /main', () => {
    const push = vi.fn();
    const wrapper = mount(PieChartWithAccordion, {
      global: { mocks: { $router: { push } } }
    });
    wrapper.vm.navigateBack();
    expect(push).toHaveBeenCalledWith('/');
  });

  it('adds and removes resize listener', () => {
    const wrapper = mount(PieChartWithAccordion);
    expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('handles API errors without throwing', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error('Boom'));

    const wrapper = mount(PieChartWithAccordion);
    await flushPromises();

    expect(wrapper.vm.chartData).toEqual([]);  // stays empty
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching solar contributions:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
