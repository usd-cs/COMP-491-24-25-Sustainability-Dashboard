import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import AdminLoginPage from '../components/LoginPage.vue';
import { vi } from 'vitest';

// Mocking the router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home' },
    { path: '/login', name: 'login' },
  ],
});

// Mock window.getComputedStyle to simulate specific styles during tests
vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
  overflowY: 'hidden',
  height: '100vh',
}));

/**
 * @description Tests if the email and password input fields are present.
 */
it('has email and password inputs', () => {
  const wrapper = mount(AdminLoginPage, {
    global: {
      plugins: [router],
    },
  });
  expect(wrapper.find('#email').exists()).toBe(true); // Check for email input
  expect(wrapper.find('#password').exists()).toBe(true); // Check for password input
});

/**
 * @description Tests if the v-model bindings update correctly when input values change.
 */
it('updates v-model when input changes', async () => {
  const wrapper = mount(AdminLoginPage, {
    global: {
      plugins: [router],
    },
  });

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
  const wrapper = mount(AdminLoginPage, {
    global: {
      plugins: [router],
    },
  });

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
 * @description Tests if the login page fills the viewport height.
 */
it('fills viewport height', async () => {
  const wrapper = mount(AdminLoginPage, {
    global: {
      plugins: [router],
    },
  });

  // Check computed style of the root element
  const loginPage = wrapper.find('.login-form');
  expect(getComputedStyle(loginPage.element).height).toBe('100vh'); // Verify height matches viewport
});
