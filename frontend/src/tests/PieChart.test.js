import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PieChart from '../components/PieChart.vue';
import * as echarts from 'echarts';
import axios from 'axios';

// Setup mock for window object with all required methods
global.window = {
    devicePixelRatio: 1,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
};

// Create a mock chart instance
const mockChartInstance = {
    setOption: vi.fn(),
    resize: vi.fn(),
    dispose: vi.fn()
};

// Mock echarts with more complete implementation
vi.mock('echarts', () => ({
    init: vi.fn(() => mockChartInstance),
    use: vi.fn(),
    getInstanceByDom: vi.fn()
}));

// Mock axios
vi.mock('axios');

describe('PieChart.vue', () => {
    let wrapper;

    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();
        
        // Mock API response
        axios.get.mockResolvedValue({ 
            data: {
                co2_production_lbs: '100',
                electricity_out_kwh: '100',
                so2_reduction_lbs: '100'
            }
        });

        // Create element mock for chart container
        document.body.innerHTML = '<div id="chart-container"></div>';
        
        // Mount component
        wrapper = mount(PieChart);
    });

    afterEach(() => {
        // Clean up after each test
        if (wrapper && wrapper.unmount) {
            wrapper.unmount();
        }
        vi.clearAllMocks();
        document.body.innerHTML = '';
    });

    it('renders the chart container', () => {
        expect(wrapper.find('.chart-container').exists()).toBe(true);
    });

    it('makes the correct API call on mount', async () => {
        await wrapper.vm.$nextTick();
        expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/api/tables/getenergy');
    });

    it('initializes echarts with basic chart options', async () => {
        await wrapper.vm.$nextTick();
        expect(echarts.init).toHaveBeenCalled();
        
        const options = mockChartInstance.setOption.mock.calls[0][0];
        expect(options.title.text).toBe('Emissions Production Distribution');
        expect(options.series[0].type).toBe('pie');
    });

    it('handles API errors gracefully', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error');
        axios.get.mockRejectedValueOnce(new Error('API Error'));
        
        const errorWrapper = mount(PieChart);
        await errorWrapper.vm.$nextTick();

        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(errorWrapper.vm.chartData).toEqual([]);
        
        errorWrapper.unmount();
    });

    it('adds and removes resize event listener', () => {
        expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
        wrapper.unmount();
        expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
});
