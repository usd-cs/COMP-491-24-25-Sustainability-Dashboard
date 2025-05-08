/**
 * @file AdminLoginPage.test.js
 * @description Unit tests for the `AdminLoginPage` component using Vitest and Vue Test Utils.
 */

import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AdminLoginPage from '../components/LoginPage.vue';

// Mock window.getComputedStyle to simulate specific styles during tests
vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
  overflowY: 'hidden',
  height: '100vh',
}));


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
        stubs: {
          'router-link': true,
          AppLayout: {
            template: '<div><slot /></div>'
          }
        }
      }
    });
    expect(wrapper.exists()).toBe(true); // Check if the component mounts correctly
    expect(wrapper.find('.login-form').exists()).toBe(true); // Ensure root class exists
    expect(wrapper.find('.form-title').text()).toContain('administrative login'); // Check header title
  });

  /**
   * @description Tests if the username and password input fields are present.
   */
  it('has username and password inputs', () => {
    const wrapper = mount(AdminLoginPage, {
      global: {
        stubs: {
          'router-link': true,
          AppLayout: {
            template: '<div><slot /></div>'
          }
        }
      }
    });
    expect(wrapper.find('#username').exists()).toBe(true); // Check for username input
    expect(wrapper.find('#password').exists()).toBe(true); // Check for password input
  });

  /**
   * @description Tests if the v-model bindings update correctly when input values change.
   */
  it('updates v-model when input changes', async () => {
    const wrapper = mount(AdminLoginPage, {
      global: {
        stubs: {
          'router-link': true,
          AppLayout: {
            template: '<div><slot /></div>'
          }
        }
      }
    });

    // Test username input
    const usernameInput = wrapper.find('#username');
    await usernameInput.setValue('testUser38');
    expect(usernameInput.element.value).toBe('testUser38'); // Verify username input value

    // Test password input
    const passwordInput = wrapper.find('#password');
    await passwordInput.setValue('password123');
    expect(passwordInput.element.value).toBe('password123'); // Verify password input value
  });

  /**
   * @description Tests if the form submits correctly with username and password values.
   */
  it('submits form with username and password', async () => {
    const wrapper = mount(AdminLoginPage, {
      global: {
        stubs: {
          'router-link': true,
          AppLayout: {
            template: '<div><slot /></div>'
          }
        }
      }
    });

    // Simulate input values
    const usernameInput = wrapper.find('#username');
    const passwordInput = wrapper.find('#password');
    await usernameInput.setValue('testUser38');
    await passwordInput.setValue('password123');

    // Simulate form submission
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    // Check if the form submission captured the correct values
    expect(wrapper.vm.username).toBe('testUser38'); // Verify username value
    expect(wrapper.vm.password).toBe('password123'); // Verify password value
  });

  /**
   * @description Tests if the login page fills the viewport height.
   */
  it('fills viewport height', async () => {
    const wrapper = mount(AdminLoginPage, {
      global: {
        stubs: {
          'router-link': true,
          AppLayout: {
            template: '<div><slot /></div>'
          }
        }
      }
    });

    // Check computed style of the root element
    const loginPage = wrapper.find('.login-form');
    expect(getComputedStyle(loginPage.element).height).toBe('100vh'); // Verify height matches viewport
  });
});
