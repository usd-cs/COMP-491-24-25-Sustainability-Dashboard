import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TreeChartExpand from '@/components/LineChartExpand.vue';
import axios from 'axios';
import * as echarts from 'echarts';

// mock axios & echarts
vi.mock('axios');
vi.mock('echarts', () => ({ init: vi.fn() }));

const flushPromises = () => new Promise(r => setTimeout(r, 0));

describe('TreeChartExpand.vue', () => {
  let mockChart;

  beforeEach(() => {
    vi.clearAllMocks();
    // stub API
    axios.get.mockResolvedValue({
      data: [{ lifetime_energy: '2000', period_energy: '500' }]
    });
    // stub chart instance
    mockChart = { setOption: vi.fn(), resize: vi.fn(), dispose: vi.fn() };
    echarts.init.mockReturnValue(mockChart);
  });

  it('fetches data on mount and renders chart', async () => {
    mount(TreeChartExpand);
    await flushPromises();

    const apiUrl = import.meta.env.VITE_API_URL;
    // default period is "1 year"
    expect(axios.get).toHaveBeenCalledWith(
      `${apiUrl}api/tables/gettreedata?period=1%20year`
    );

    // chart initialization
    expect(echarts.init).toHaveBeenCalled();
    const opts = mockChart.setOption.mock.calls[0][0];
    expect(opts.series).toHaveLength(2);
    expect(opts.series[0].data).toEqual([500]);
    expect(opts.series[1].data).toEqual([2000]);
  });

  it('shows loading then replaces with chart', async () => {
    const wrapper = mount(TreeChartExpand);
    // initial loading
    expect(wrapper.find('.loading').exists()).toBe(true);

    await flushPromises();
    // after fetch
    expect(wrapper.find('.loading').exists()).toBe(false);
    expect(wrapper.find('.error').exists()).toBe(false);
  });

  it('handles API error by showing message', async () => {
    axios.get.mockRejectedValueOnce(new Error('Server error'));
    const wrapper = mount(TreeChartExpand);
    await flushPromises();
    expect(wrapper.find('.error').text()).toContain('Server error');
  });

  it('re-fetches data when period is changed', async () => {
    const wrapper = mount(TreeChartExpand);
    await flushPromises();
    vi.clearAllMocks();

    const select = wrapper.find('select');
    await select.setValue('6 months');
    await flushPromises();

    const apiUrl = import.meta.env.VITE_API_URL;
    expect(axios.get).toHaveBeenCalledWith(
      `${apiUrl}api/tables/gettreedata?period=6%20months`
    );
  });
});
