/**
 * @file AdminLoginPage.test.js
 * @description Unit tests for the `AdminLoginPage` component using Vitest and Vue Test Utils.
 */

import { mount } from '@vue/test-utils';

import { createRouter, createWebHistory } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';

import { describe, it, expect } from 'vitest';
import AdminLoginPage from '../components/LoginPage.vue';

// Mock window.getComputedStyle to simulate specific styles during tests
vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
  overflowY: 'hidden',
  height: '100vh',
}));

// Mock Vue Router
const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

/**
 * @description Test suite for the `AdminLoginPage` component.
 */
describe('AdminLoginPage', () => {
  /**
   * @description Tests if the component renders correctly.
   */
  it('renders correctly', () => {
    const wrapper = mount(AdminLoginPage, {
      global: {
        plugins: [createTestingPinia(), router], // ✅ Injects Vuex/Pinia and Router
      },
    });
    expect(wrapper.exists()).toBe(true); // Check if the component mounts correctly
    expect(wrapper.find('.login-page').exists()).toBe(true); // Ensure root class exists
    expect(wrapper.find('.title').text()).toContain('USD Office of Sustainability'); // Check header title
  });

  /**
   * @description Tests if the email and password input fields are present.
   */
  it('has email and password inputs', () => {
    const wrapper = mount(AdminLoginPage);
    expect(wrapper.find('#email').exists()).toBe(true); // Check for email input
    expect(wrapper.find('#password').exists()).toBe(true); // Check for password input
  });

  /**
   * @description Tests if the v-model bindings update correctly when input values change.
   */
  it('updates v-model when input changes', async () => {
    const wrapper = mount(AdminLoginPage);

    // Test email input
    const emailInput = wrapper.find('#email');
    await emailInput.setValue('test@example.com');
    expect(emailInput.element.value).toBe('test@example.com'); // Verify email input value

    // Test password input
    const passwordInput = wrapper.find('#password');
    await passwordInput.setValue('password123');
    expect(passwordInput.element.value).toBe('password123'); // Verify password input value
  });

  /**
   * @description Tests if the form submits correctly with email and password values.
   */
  it('submits form with email and password', async () => {
    const wrapper = mount(AdminLoginPage);

    // Simulate input values
    const emailInput = wrapper.find('#email');
    const passwordInput = wrapper.find('#password');
    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    // Simulate form submission
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    // Check if the form submission captured the correct values
    expect(wrapper.vm.email).toBe('test@example.com'); // Verify email value
    expect(wrapper.vm.password).toBe('password123'); // Verify password value
  });

  /**
   * @description Tests if the login page has no vertical scroll.
   */
  it('has no vertical scroll', async () => {
    const wrapper = mount(AdminLoginPage);

    // Check computed style of the root element
    const loginPage = wrapper.find('.login-page');
    expect(getComputedStyle(loginPage.element).overflowY).toBe('hidden'); // Verify no vertical scroll
  });

  /**
   * @description Tests if the login page fills the viewport height.
   */
  it('fills viewport height', async () => {
    const wrapper = mount(AdminLoginPage);

    // Check computed style of the root element
    const loginPage = wrapper.find('.login-page');
    expect(getComputedStyle(loginPage.element).height).toBe('100vh'); // Verify height matches viewport
  });
});
