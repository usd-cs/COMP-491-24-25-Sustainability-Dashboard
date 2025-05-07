import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EnergyQuadrants from '../components/EnergyQuadrants.vue';

describe('EnergyQuadrants', () => {
  it('renders the component with title', () => {
    const wrapper = mount(EnergyQuadrants);
    expect(wrapper.find('.title').text()).toBe('What Does 20,000 kWh Mean to You?');
  });

  it('renders all four quadrants initially', () => {
    const wrapper = mount(EnergyQuadrants);
    const quadrants = wrapper.findAll('.quadrant');
    expect(quadrants).toHaveLength(4);
  });

  it('displays correct data in quadrants', () => {
    const wrapper = mount(EnergyQuadrants);
    const quadrants = wrapper.findAll('.quadrant');
    
    // Check first quadrant (car)
    expect(quadrants[0].find('.value').text()).toBe('1.1');
    expect(quadrants[0].find('.label').text()).toBe('Gas cars / year');
    
    // Check second quadrant (house)
    expect(quadrants[1].find('.value').text()).toBe('1.6');
    expect(quadrants[1].find('.label').text()).toBe('Homes (electricity/year)');
  });

  it('shows expanded view when quadrant is clicked', async () => {
    const wrapper = mount(EnergyQuadrants);
    const firstQuadrant = wrapper.findAll('.quadrant')[0];
    
    await firstQuadrant.trigger('click');
    
    expect(wrapper.find('.expanded').exists()).toBe(true);
    expect(wrapper.find('.back-btn').exists()).toBe(true);
    expect(wrapper.find('.details').text()).toContain("That's the CO₂ from roughly 1.1 average gasoline-powered cars");
  });

  it('returns to grid view when back button is clicked', async () => {
    const wrapper = mount(EnergyQuadrants);
    
    // Click first quadrant
    await wrapper.findAll('.quadrant')[0].trigger('click');
    expect(wrapper.find('.expanded').exists()).toBe(true);
    
    // Click back button
    await wrapper.find('.back-btn').trigger('click');
    expect(wrapper.find('.grid').exists()).toBe(true);
    expect(wrapper.find('.expanded').exists()).toBe(false);
  });

  it('renders all required images', () => {
    const wrapper = mount(EnergyQuadrants);
    const images = wrapper.findAll('.icon-img');
    expect(images).toHaveLength(4);
  });
}); 