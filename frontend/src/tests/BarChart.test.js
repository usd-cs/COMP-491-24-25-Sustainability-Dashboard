// frontend/src/tests/BarChart.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BarChart from '@/components/BarChart.vue';
import axios from 'axios';
import * as echarts from 'echarts';

vi.mock('axios');
vi.mock('echarts', () => ({ init: vi.fn() }));

const flushPromises = () => new Promise(r => setTimeout(r, 0));

describe('BarChart.vue', () => {
  let mockInstance;
  const fakeWeeklyData = [
    { week_start: '2025-01-01', total_fuelcell_kwh: '1000', total_solar_kwh: '500' },
    { week_start: '2025-01-08', total_fuelcell_kwh: '1100', total_solar_kwh: '600' },
    { week_start: '2025-01-15', total_fuelcell_kwh: '1200', total_solar_kwh: '700' },
    { week_start: '2025-01-22', total_fuelcell_kwh: '1300', total_solar_kwh: '800' }
  ];

  beforeEach(() => {
    // First call returns the weekly data
    axios.get.mockResolvedValue({ data: fakeWeeklyData });

    mockInstance = {
      setOption: vi.fn(),
      resize: vi.fn(),
      dispose: vi.fn(),
      on: vi.fn((evt, cb) => {
        mockInstance._handlers = mockInstance._handlers || {};
        mockInstance._handlers[evt] = cb;
      })
    };
    echarts.init.mockReturnValue(mockInstance);
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('processes API data into ascending weekDates, fuelCell, solarPanels, and exact categories', async () => {
    const wrapper = mount(BarChart);
    await flushPromises();

    // weekDates should match the fake data in order
    expect(wrapper.vm.weekDates).toEqual([
      '2025-01-01',
      '2025-01-08',
      '2025-01-15',
      '2025-01-22'
    ]);

    // fuelCell & solarPanels formatted as strings with two decimals
    expect(wrapper.vm.fuelCell).toEqual(['1000.00', '1100.00', '1200.00', '1300.00']);
    expect(wrapper.vm.solarPanels).toEqual(['500.00', '600.00', '700.00', '800.00']);

    // categories should be "MM/DD - MM/DD" with exactly +6 days
    const expectedCategories = wrapper.vm.weekDates.map(ws => {
      const d = new Date(ws);
      const start = d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      const e = new Date(d);
      e.setDate(d.getDate() + 6);
      const end = e.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      return `${start} - ${end}`;
    });
    expect(wrapper.vm.categories).toEqual(expectedCategories);
  });

  it('emits drilldown with correct weekStart when a bar is clicked', async () => {
    const wrapper = mount(BarChart);
    await flushPromises();

    // simulate clicking the second bar (dataIndex = 1)
    mockInstance._handlers.click({
      seriesName: 'Solar Panels',
      dataIndex: 1
    });

    const emitted = wrapper.emitted('drilldown');
    expect(emitted).toHaveLength(1);
    expect(emitted[0][0]).toEqual({
      seriesName: 'Solar Panels',
      weekStart: '2025-01-08'
    });
  });

  it('removes the resize listener on unmount', async () => {
    const wrapper = mount(BarChart);
    await flushPromises();
    wrapper.unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});
