import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DashboardLayout from '../components/MainPage.vue';

describe('DashboardLayout', () => {
  it('renders correctly', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.exists()).toBe(true);
  });

  it('has a user section', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.find('.user-section').exists()).toBe(true);
  });

  it('has logout button', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.find('.logout-btn').exists()).toBe(true); // Updated class name
  });

  it('has correct navigation items', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.findAll('.nav-item')).toHaveLength(4);
  });

  it('has upload button', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.find('.upload-button').text()).toBe('Upload Data');
  });
});
