import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';
import DashboardLayout from '../components/MainPage.vue';

// Create a mock Vue Router instance
const mockRouter = createRouter({
  history: createWebHistory(),
  routes: [],
});

// Spy on the router's `push` method to verify navigation
vi.spyOn(mockRouter, 'push');

/**
 * @description Test suite for the `DashboardLayout` component.
 */
describe('DashboardLayout', () => {
  /**
   * @description Tests if the component renders correctly.
   */
  it('renders correctly', () => {
    const wrapper = mount(DashboardLayout, {
      global: {
        plugins: [mockRouter], // Add mock router as a plugin
      },
    });
    expect(wrapper.exists()).toBe(true); // Check if the component mounts correctly
  });

  /**
   * @description Tests if the logout button is present in the layout.
   */
  it('has logout button', () => {
    const wrapper = mount(DashboardLayout, {
      global: {
        plugins: [mockRouter], // Add mock router as a plugin
      },
    });
    expect(wrapper.find('.logout-btn').exists()).toBe(true); // Verify logout button exists
  });
});
