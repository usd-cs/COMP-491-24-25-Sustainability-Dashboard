import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BubbleChart from '@/components/BubbleChart.vue';
import axios from 'axios';
import * as echarts from 'echarts';
import { nextTick } from 'vue';

// --- mocks ---
vi.mock('axios');
vi.mock('echarts', () => ({ init: vi.fn() }));

const flushPromises = () => new Promise(r => setTimeout(r, 0));

describe('BubbleChart.vue', () => {
  let mockInstance;
  const mockData = [
    { date_local: '2025-01-01', gas_flow_in_therms: '10', electricity_out_kwh: '20' },
    { date_local: '2025-01-02', gas_flow_in_therms: '15', electricity_out_kwh: '30' },
    { date_local: '2025-01-03', gas_flow_in_therms: '20', electricity_out_kwh: '25' },
  ];

  beforeEach(() => {
    // stub axios
    axios.get.mockResolvedValue({ data: mockData });
    // stub echarts instance
    mockInstance = { setOption: vi.fn(), resize: vi.fn() };
    echarts.init.mockReturnValue(mockInstance);
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches and transforms data correctly', async () => {
    const wrapper = mount(BubbleChart);
    await flushPromises();

    // API called
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/tables/getbubblechart');

    // chartData must be array of {date, gas, output}
    expect(wrapper.vm.chartData).toEqual([
      { date: '2025-01-01', gas: 10, output: 20 },
      { date: '2025-01-02', gas: 15, output: 30 },
      { date: '2025-01-03', gas: 20, output: 25 },
    ]);
  });

  it('calculates regression & renders chart with correct series and tooltip', async () => {
    const wrapper = mount(BubbleChart);
    await flushPromises();
    await nextTick();

    // compute expected regression
    const gas = [10,15,20], out = [20,30,25], n = 3;
    const meanX = gas.reduce((a,b)=>a+b,0)/n;
    const meanY = out.reduce((a,b)=>a+b,0)/n;
    let num=0, den=0;
    for (let i=0; i<n; i++){
      num += (gas[i]-meanX)*(out[i]-meanY);
      den += (gas[i]-meanX)**2;
    }
    const slope = den===0 ? 0 : num/den;
    const intercept = meanY - slope*meanX;
    const trendline = gas.map(x => [x, slope*x + intercept]);

    // echarts.init called on the chart container
    expect(echarts.init).toHaveBeenCalledWith(wrapper.vm.$refs.chart);
    // grab the options passed
    const opts = mockInstance.setOption.mock.calls[0][0];

    // scatter data
    expect(opts.series[0].data).toEqual(gas.map((x,i) => [x, out[i]]));
    // trendline data
    expect(opts.series[1].data).toEqual(trendline);

    // test tooltip formatter for a data point
    const fmt = opts.tooltip.formatter;
    const sample = fmt({ seriesName: 'Daily Output vs Fuel Input', dataIndex: 1 });
    expect(sample).toContain('Gas: 15.00 therms');
    expect(sample).toContain('Output: 30.00 kWh');
    // test tooltip on the trendline
    const trendFmt = fmt({ seriesName: 'Trendline', dataIndex: 0 });
    expect(trendFmt).toContain(`Trendline: y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`);
  });

  it('cleans up resize listener on unmount', async () => {
    const wrapper = mount(BubbleChart);
    await flushPromises();
    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
