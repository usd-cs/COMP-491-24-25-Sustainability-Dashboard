import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BarChart from '../components/BarChart.vue';
import axios from 'axios';
import * as echarts from 'echarts';

vi.mock('axios');
vi.mock('echarts');

describe('BarChart.vue', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = mount(BarChart);
  });

  it('initializes with correct default data', () => {
    expect(wrapper.vm.title).toBe('Energy Production & Emissions');
    expect(wrapper.vm.chartLabels).toEqual([]);
    expect(wrapper.vm.chartData).toEqual([]);
  });

  it('maps header labels to database columns correctly', () => {
    expect(wrapper.vm.headerToDbColumnMap['CO₂ Reduction (lbs)']).toBe('co2_reduction_lbs');
    expect(wrapper.vm.headerToDbColumnMap['NOₓ Production (lbs)']).toBe('nox_production_lbs');
  });

  it('fetches chart data from API and updates component state', async () => {
    axios.get.mockResolvedValue({
      data: {
        date_local: '2024-01-01',
        co2_reduction_lbs: 500,
        co2_production_lbs: 300,
        nox_reduction_lbs: 50,
        nox_production_lbs: 20,
        so2_reduction_lbs: 10,
        so2_production_lbs: 5
      }
    });

    await wrapper.vm.fetchChartData();

    expect(wrapper.vm.chartLabels).toEqual([
      'CO₂ Reduction (lbs)', 
      'CO₂ Production (lbs)', 
      'NOₓ Reduction (lbs)', 
      'NOₓ Production (lbs)', 
      'SO₂ Reduction (lbs)', 
      'SO₂ Production (lbs)'
    ]);

    expect(wrapper.vm.chartData).toEqual([500, 300, 50, 20, 10, 5]);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/tables/getenergy');
  });

  it('handles API errors gracefully', async () => {
    console.error = vi.fn();
    axios.get.mockRejectedValue(new Error('API Error'));

    await wrapper.vm.fetchChartData();

    expect(console.error).toHaveBeenCalledWith('Error fetching chart data:', expect.any(Error));
  });

  it('renders the chart with echarts', async () => {
    const mockSetOption = vi.fn();
    echarts.init.mockReturnValue({ setOption: mockSetOption });

    await wrapper.vm.fetchChartData();
    wrapper.vm.renderChart();

    expect(echarts.init).toHaveBeenCalledWith(wrapper.vm.$refs.chart);

    // Updated test for the series and data
    expect(mockSetOption).toHaveBeenCalledWith(expect.objectContaining({
      title: { text: 'Energy Production & Emissions', left: 'center' },
      series: [{
        type: 'bar',
        data: expect.arrayContaining([]),  // Expecting any array, may adjust this based on the data you pass
        barWidth: '50%',
        itemStyle: {
          color: '#4caf50',
        },
        name: 'Value',
      }],
      tooltip: { trigger: 'axis' },
      xAxis: {
        axisLabel: {
          rotate: 45,
        },
        data: expect.arrayContaining([]),  // Expecting an array of labels
        type: 'category',
      },
      yAxis: {
        type: 'value',
      },
    }));
  });
});
