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
 * @description Test suite for the DashboardLayout.
 */
describe('DashboardLayout', () => {
  /**
   * @description Tests if the component renders correctly.
   */
  it('Main renders correctly', () => {
    const wrapper = mount(DashboardLayout, {
      global: {
        plugins: [router],
      },
    });
    expect(wrapper.exists()).toBe(true); // Check if the component mounts correctly
  });

  /**
   * @description Tests if the graph display area is present in the layout.
   */
  it('has graph display', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.find('.visual-container').exists()).toBe(true);
  });
});
