import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TreeChart from '@/components/LineChart.vue';
import axios from 'axios';
import * as echarts from 'echarts';

// mock axios & echarts
vi.mock('axios');
vi.mock('echarts', () => ({ init: vi.fn() }));

const flushPromises = () => new Promise(r => setTimeout(r, 0));

describe('TreeChart.vue', () => {
  let mockChart;

  beforeEach(() => {
    vi.clearAllMocks();

    // stub API
    axios.get.mockResolvedValue({
      data: [{ lifetime_energy: '1000', period_energy: '250' }]
    });

    // stub chart instance
    mockChart = { setOption: vi.fn(), resize: vi.fn(), dispose: vi.fn() };
    echarts.init.mockReturnValue(mockChart);
  });

  it('shows loading initially and then hides it after fetch', async () => {
    const wrapper = mount(TreeChart);
    // loading spinner shown
    expect(wrapper.find('.loading').exists()).toBe(true);

    await flushPromises();
    await wrapper.vm.$nextTick();

    // after data arrives, loading disappears
    expect(wrapper.find('.loading').exists()).toBe(false);
    expect(wrapper.find('.error').exists()).toBe(false);
  });

  it('fetches data on mount with default period and initializes chart', async () => {
    mount(TreeChart);
    await flushPromises();

    const apiUrl = import.meta.env.VITE_API_URL;
    // correct endpoint with default "1 year"
    expect(axios.get).toHaveBeenCalledWith(
      `${apiUrl}api/tables/gettreedata?period=1%20year`
    );

    // chart should be initialized once
    expect(echarts.init).toHaveBeenCalled();
    // options should include our title and series of length 2
    const opts = mockChart.setOption.mock.calls[0][0];
    expect(opts.title.text).toBe('Campus Renewable Energy Output');
    expect(opts.series).toHaveLength(2);
    // filled portion data is [250], background is [1000]
    expect(opts.series[0].data).toEqual([250]);
    expect(opts.series[1].data).toEqual([1000]);
  });

  it('displays an error message if API fails or data incomplete', async () => {
    // first test network error
    axios.get.mockRejectedValueOnce(new Error('Network down'));
    const wrapper = mount(TreeChart);
    await flushPromises();
    expect(wrapper.find('.error').text()).toContain('Network down');

    // then test incomplete payload
    axios.get.mockResolvedValueOnce({ data: [{}] });
    await wrapper.vm.fetchData();
    await flushPromises();
    expect(wrapper.find('.error').text()).toContain('Incomplete energy data');
  });

  it('re-fetches when period selection changes', async () => {
    const wrapper = mount(TreeChart);
    await flushPromises();
    vi.clearAllMocks();

    const select = wrapper.find('select');
    await select.setValue('6 months');
    // trigger change
    await flushPromises();
    const apiUrl = import.meta.env.VITE_API_URL;
    expect(axios.get).toHaveBeenCalledWith(
      `${apiUrl}api/tables/gettreedata?period=6%20months`
    );
  });
});
