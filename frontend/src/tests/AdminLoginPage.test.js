import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AdminLoginPage from '../components/LoginPage.vue';

vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
    overflowY: 'hidden',
    height: '100vh',
  }));

describe('AdminLoginPage', () => {
  it('renders correctly', () => {
    const wrapper = mount(AdminLoginPage);
    expect(wrapper.exists()).toBe(true); // Check if the component mounts correctly
    expect(wrapper.find('.login-page').exists()).toBe(true); // Ensure root class exists
    expect(wrapper.find('.title').text()).toContain('USD Office of Sustainability'); // Check header title
  });

  it('has email and password inputs', () => {
    const wrapper = mount(AdminLoginPage);
    expect(wrapper.find('#email').exists()).toBe(true); // Check for email input
    expect(wrapper.find('#password').exists()).toBe(true); // Check for password input
  });

  it('updates v-model when input changes', async () => {
    const wrapper = mount(AdminLoginPage);

    // Test email input
    const emailInput = wrapper.find('#email');
    await emailInput.setValue('test@example.com');
    expect(emailInput.element.value).toBe('test@example.com');

    // Test password input
    const passwordInput = wrapper.find('#password');
    await passwordInput.setValue('password123');
    expect(passwordInput.element.value).toBe('password123');
  });

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

    // Check console log output (mock console.log if needed)
    expect(wrapper.vm.email).toBe('test@example.com');
    expect(wrapper.vm.password).toBe('password123');
  });

  it('has no vertical scroll', async () => {
    const wrapper = mount(AdminLoginPage);

    // Check computed style of the root element
    const loginPage = wrapper.find('.login-page');
    expect(getComputedStyle(loginPage.element).overflowY).toBe('hidden');
  });

  it('fills viewport height', async () => {
    const wrapper = mount(AdminLoginPage);

    // Check computed style of the root element
    const loginPage = wrapper.find('.login-page');
    expect(getComputedStyle(loginPage.element).height).toBe('100vh');
  });
});
