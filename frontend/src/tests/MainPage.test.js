import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DashboardLayout from '../components/MainPage.vue';

describe('DashboardLayout', () => {
  it('renders correctly', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.exists()).toBe(true);
  });

  it('displays welcome message', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.find('.welcome-text').text()).toBe('Hi, John');
  });

  it('has logout button', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.find('.logout-button').exists()).toBe(true);
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
