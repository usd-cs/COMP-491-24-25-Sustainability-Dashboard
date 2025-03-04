/**
 * @file DashboardLayout.test.js
 * @description Unit tests for the `DashboardLayout` component using Vitest and Vue Test Utils.
 */

import { mount } from '@vue/test-utils';

import { createRouter, createWebHistory } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';

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
   * @description Tests if the user section exists in the layout.
   */
  it('has a user section', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.find('.user-section').exists()).toBe(true); // Verify user section is present
  });

  /**
   * @description Tests if the logout button is present in the layout.
   */
  it('has logout button', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.find('.logout-btn').exists()).toBe(true); // Verify logout button exists
  });

  /**
   * @description Tests if the correct number of navigation items are present.
   */
  it('has correct navigation items', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.findAll('.nav-item')).toHaveLength(4); // Verify four navigation items exist
  });

  /**
   * @description Tests if the upload button is present and has the correct text.
   */
  it('has upload button', () => {
    const wrapper = mount(DashboardLayout);
    expect(wrapper.find('.upload-button').text()).toBe('Upload Data'); // Verify upload button text
  });
});
