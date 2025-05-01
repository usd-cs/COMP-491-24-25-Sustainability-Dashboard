import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BarChartExpand from '@/components/BarChartExpand.vue';
import axios from 'axios';
import * as echarts from 'echarts';

vi.mock('axios');
vi.mock('echarts', () => ({ init: vi.fn() }));

const flushPromises = () => new Promise(r => setTimeout(r, 0));

describe('BarChartExpand.vue', () => {
  let mockInstance;
  let routerPush;
  const fakeWeeklyData = [
    { week_start: '2025-02-01', total_fuelcell_kwh: '2000', total_solar_kwh: '1000' },
    { week_start: '2025-02-08', total_fuelcell_kwh: '2100', total_solar_kwh: '1100' },
    { week_start: '2025-02-15', total_fuelcell_kwh: '2200', total_solar_kwh: '1200' },
    { week_start: '2025-02-22', total_fuelcell_kwh: '2300', total_solar_kwh: '1300' }
  ];
  const fakeDailyData = [
    { day_name: 'Mon', day_number: 1, fuelcell_kwh: '100', solar_kwh: '50' },
    { day_name: 'Tue', day_number: 2, fuelcell_kwh: '110', solar_kwh: '55' },
    { day_name: 'Wed', day_number: 3, fuelcell_kwh: '120', solar_kwh: '60' },
    { day_name: 'Thu', day_number: 4, fuelcell_kwh: '130', solar_kwh: '65' },
    { day_name: 'Fri', day_number: 5, fuelcell_kwh: '140', solar_kwh: '70' },
    { day_name: 'Sat', day_number: 6, fuelcell_kwh: '150', solar_kwh: '75' },
    { day_name: 'Sun', day_number: 7, fuelcell_kwh: '160', solar_kwh: '80' }
  ];

  beforeEach(() => {
    // First call → weekly, second call → daily
    axios.get
      .mockResolvedValueOnce({ data: fakeWeeklyData })
      .mockResolvedValueOnce({ data: fakeDailyData });

    mockInstance = {
      setOption: vi.fn(),
      dispose: vi.fn(),
      resize: vi.fn(),
      on: vi.fn((evt, cb) => {
        mockInstance._handlers = mockInstance._handlers || {};
        mockInstance._handlers[evt] = cb;
      })
    };
    echarts.init.mockReturnValue(mockInstance);

    routerPush = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches weekly data then initializes chart', async () => {
    const wrapper = mount(BarChartExpand, {
      global: { mocks: { $router: { push: routerPush } } }
    });
    await flushPromises();

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/tables/getcombinedweekly');
    expect(echarts.init).toHaveBeenCalledWith(wrapper.vm.$refs.chart);

    // Ascending weekDates
    expect(wrapper.vm.weekDates).toEqual([
      '2025-02-01',
      '2025-02-08',
      '2025-02-15',
      '2025-02-22'
    ]);
  });

  it('drills into daily data on bar click (dataIndex=1)', async () => {
    const wrapper = mount(BarChartExpand, {
      global: { mocks: { $router: { push: routerPush } } }
    });
    await flushPromises();

    // click the 2nd bar
    mockInstance._handlers.click({
      seriesName: 'Fuel Cell',
      dataIndex: 1
    });
    await flushPromises();

    expect(wrapper.vm.isDrilldown).toBe(true);
    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:3000/api/tables/getcombinedweekly/daily',
      { params: { weekStart: '2025-02-08' } }
    );
  });

  it('back button navigates home from overview, and resets drilldown', async () => {
    const wrapper = mount(BarChartExpand, {
      global: { mocks: { $router: { push: routerPush } } }
    });
    await flushPromises();

    // Overview mode → X should go to /main
    await wrapper.find('button.close-btn').trigger('click');
    expect(routerPush).toHaveBeenCalledWith('/');

    // Now simulate we are in drilldown
    wrapper.vm.isDrilldown = true;
    axios.get.mockResolvedValueOnce({ data: fakeWeeklyData }); // re‑mock for re‑fetch
    await wrapper.find('button.close-btn').trigger('click');

    expect(wrapper.vm.isDrilldown).toBe(false);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/tables/getcombinedweekly');
  });
});
