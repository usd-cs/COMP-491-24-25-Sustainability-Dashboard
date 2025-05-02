/**
 * @file MainPage.test.js
 * @description Unit tests for the `MainPage` component using Vitest and Vue Test Utils.
 */

import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { describe, it, expect } from 'vitest';
import DashboardLayout from '../components/MainPage.vue';

//Mock Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes: [],
});


/**
 * @description Test suite for the `DashboardLayout` component.
 */
describe('DashboardLayout', () => {
  /**
   * @description Tests if the component renders correctly.
   */
  it('renders correctly', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.exists()).toBe(true); // Check if the component mounts correctly
  });

  /**
   * @description Tests if the logout button is present in the layout.
   */
  it('has logout button', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.find('.logout-btn').exists()).toBe(true); // Verify logout button exists
  });


});
