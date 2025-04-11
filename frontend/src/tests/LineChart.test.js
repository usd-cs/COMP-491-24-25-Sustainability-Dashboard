import { mount } from '@vue/test-utils'
import LineChart from '@/components/LineChart.vue'

/**
 * Dummy chart data used for testing.
 */
const dummyChartData = {
  labels: ['January', 'February', 'March', 'April'],
  datasets: [
    {
      label: 'Demo Data',
      backgroundColor: '#f87979',
      data: [40, 20, 30, 50]
    }
  ]
}

/**
 * Dummy chart options used for testing.
 */
const dummyChartOptions = {}

/**
 * Test suite for the LineChart.vue component.
 */
describe('LineChart.vue', () => {
    /**
     * Test that verifies a loading indicator is displayed initially.
     */
    it('shows a loading indicator initially', () => {
        // Mount the component with dummy props.
        const wrapper = mount(LineChart, {
            props: {
                chartData: dummyChartData,
                chartOptions: dummyChartOptions 
            }
        })
        
        // Find the element with class "loading" and verify it exists and contains the correct text.
        const loading = wrapper.find('.loading')
        expect(loading.exists()).toBe(true)
        expect(loading.text()).toBe('Loading...')
    })

    /**
     * Test that checks whether the component correctly receives and displays chart data props.
     */
    it('correctly receives and displays chart data props', () => {
        // Mount the component with dummy props.
        const wrapper = mount(LineChart, {
            props: {
                chartData: dummyChartData,
                chartOptions: dummyChartOptions
            }
        })

        // Assert that the component instance properties match the dummy data.
        expect(wrapper.vm.chartData).toEqual(dummyChartData)
        expect(wrapper.vm.chartOptions).toEqual(dummyChartOptions)
    })

    /**
     * Test to ensure the component handles empty chart data without errors.
     */
    it('handles empty chart data gracefully', () => {
        // Define empty chart data.
        const emptyData = {
            labels: [],
            datasets: []
        }
        
        // Mount the component with empty chart data and dummy chart options.
        const wrapper = mount(LineChart, {
            props: {
                chartData: emptyData,
                chartOptions: dummyChartOptions
            }
        })

        // Verify that empty datasets and labels have been received.
        expect(wrapper.vm.chartData.datasets).toHaveLength(0)
        expect(wrapper.vm.chartData.labels).toHaveLength(0)
    })

    /**
     * Test that verifies the component updates correctly when the chart data changes.
     */
    it('updates when chart data changes', async () => {
        // Mount the component with initial dummy chart data.
        const wrapper = mount(LineChart, {
            props: {
                chartData: dummyChartData,
                chartOptions: dummyChartOptions
            }
        })

        // Define new chart data to update the component with.
        const newData = {
            labels: ['A', 'B'],
            datasets: [{
                label: 'New Data',
                data: [10, 20]
            }]
        }

        // Update props with the new data.
        await wrapper.setProps({ chartData: newData })
        // Assert that the component instance reflects the updated chart data.
        expect(wrapper.vm.chartData).toEqual(newData)
    })
})
