import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PieChart from '../components/PieChart.vue';
import * as echarts from 'echarts';

// --- Mocks ---
vi.mock('echarts', () => ({
    init: vi.fn(() => ({
        setOption: vi.fn(),
        resize: vi.fn(),
    })),
}));

describe('PieChart.vue', () => {
    let wrapper;
    const hardcodedData = [
        { name: 'Calpine Energy (61%)', value: 15035 },
        { name: 'Bloom Energy Fuel Cell (30%)', value: 7281 },
        { name: 'Solar Panels (7%)', value: 1593 },
        { name: 'SDG&E (2%)', value: 552 }
    ];

    beforeEach(() => {
        wrapper = mount(PieChart);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders the chart container', () => {
        expect(wrapper.find('.chart-container').exists()).toBe(true);
    });

    it('initializes echarts on mount', async () => {
        await wrapper.vm.$nextTick();

        expect(echarts.init).toHaveBeenCalled();
        const chartInstance = echarts.init.mock.results[0].value;
        expect(chartInstance.setOption).toHaveBeenCalled();
    });

    it('uses the correct hardcoded data', async () => {
        await wrapper.vm.$nextTick();

        // Verify the data being passed to ECharts
        const chartInstance = echarts.init.mock.results[0].value;
        const lastSetOptionCall = chartInstance.setOption.mock.calls[0][0];

        expect(lastSetOptionCall.series[0].data).toEqual(hardcodedData);
    });

    it('renders the chart with correct options', async () => {
        await wrapper.vm.$nextTick();

        const chartInstance = echarts.init.mock.results[0].value;
        const lastSetOptionCall = chartInstance.setOption.mock.calls[0][0];

        expect(lastSetOptionCall.title.text).toBe('Energy Sources Distribution');
        expect(lastSetOptionCall.series[0].type).toBe('pie');
        expect(lastSetOptionCall.series[0].radius).toBe('40%');
    });
});
