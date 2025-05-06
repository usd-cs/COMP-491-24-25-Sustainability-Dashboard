import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Initiatives from '../components/Initiatives.vue'

// Mock chart components
vi.mock('../components/EmissionsChart.vue', () => ({ default: { name: 'EmissionsChart', template: '<div>EmissionsChart</div>' } }))
vi.mock('../components/WaterUsageChart.vue', () => ({ default: { name: 'WaterUsageChart', template: '<div>WaterUsageChart</div>' } }))
vi.mock('../components/WasteChart.vue', () => ({ default: { name: 'WasteChart', template: '<div>WasteChart</div>' } }))
vi.mock('../components/VehicleGraph.vue', () => ({ default: { name: 'VehicleGraph', template: '<div>VehicleGraph</div>' } }))
vi.mock('../components/AppLayout.vue', () => ({ default: { name: 'AppLayout', template: '<div><slot /></div>' } }))

global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
describe('Initiatives.vue', () => {
  it('renders the quote and president name', () => {
    const wrapper = mount(Initiatives)
    expect(wrapper.text()).toContain('We commit to going carbon neutral by 2035')
    expect(wrapper.text()).toContain('President Harris')
  })

  it('contains the correct number of blurbs in the script', () => {
  const wrapper = mount(Initiatives)
  // Access the blurbs array from the component instance
  expect(wrapper.vm.blurbs.length).toBe(13)
  // Check the content of the first blurb
  expect(wrapper.vm.blurbs[0].text).toContain('In response to increasing demand from')
})

  it('renders the correct chart component for the initial step', () => {
    const wrapper = mount(Initiatives)
    // The first chart should be EmissionsChart
    expect(wrapper.html()).toContain('EmissionsChart')
  })

  it('renders the correct chart when activeStep changes', async () => {
    const wrapper = mount(Initiatives)
    // Set activeStep to 2 (WasteChart)
    await wrapper.vm.$nextTick()
    wrapper.vm.activeStep = 2
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toContain('WasteChart')
  })
})