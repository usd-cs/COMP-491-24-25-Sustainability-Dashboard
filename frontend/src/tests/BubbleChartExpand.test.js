import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BubbleChartExpand from '@/components/BubbleChartExpand.vue';
import axios from 'axios';
import * as echarts from 'echarts';
import { nextTick } from 'vue';

// --- mocks ---
vi.mock('axios');
vi.mock('echarts', () => ({ init: vi.fn() }));

const flushPromises = () => new Promise(r => setTimeout(r, 0));

describe('BubbleChartExpand.vue', () => {
  let mockInstance;
  const mockData = [
    { date_local: '2025-01-01', gas_flow_in_therms: '10', electricity_out_kwh: '20' },
    { date_local: '2025-02-01', gas_flow_in_therms: '20', electricity_out_kwh: '30' }
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockData });
    mockInstance = { setOption: vi.fn(), resize: vi.fn() };
    echarts.init.mockReturnValue(mockInstance);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches data, computes trendEquation, and renders', async () => {
    const mockPush = vi.fn();
    const wrapper = mount(BubbleChartExpand, {
      global: {
        mocks: { $router: { push: mockPush } }
      }
    });
    await flushPromises();
    await nextTick();

    // chartData transformed
    expect(wrapper.vm.chartData).toEqual([
      { date: '2025-01-01', gas: 10, output: 20 },
      { date: '2025-02-01', gas: 20, output: 30 }
    ]);

    // regression
    const meanX = (10+20)/2, meanY = (20+30)/2;
    const num = (10-meanX)*(20-meanY) + (20-meanX)*(30-meanY);
    const den = (10-meanX)**2 + (20-meanX)**2;
    const slope = den===0 ? 0 : num/den;
    const intercept = meanY - slope*meanX;
    expect(wrapper.vm.trendEquation)
      .toBe(`y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`);

    // chart init & setOption
    expect(echarts.init).toHaveBeenCalledWith(wrapper.vm.$refs.chart);
    expect(mockInstance.setOption).toHaveBeenCalled();
  });

  it('navigateBack pushes to /main', () => {
    const mockPush = vi.fn();
    const wrapper = mount(BubbleChartExpand, {
      global: { mocks: { $router: { push: mockPush } } }
    });
    wrapper.vm.navigateBack();
    expect(mockPush).toHaveBeenCalledWith('/main');
  });

  it('cleans up resize listener on unmount', () => {
    vi.spyOn(window, 'removeEventListener');
    const wrapper = mount(BubbleChartExpand);
    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
