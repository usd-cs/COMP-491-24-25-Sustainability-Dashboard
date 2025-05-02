/**
 * @file UploadSuccess.test.js
 * @description Unit tests for the `UploadSuccess` component using Vitest and Vue Test Utils.
 */
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import UploadSuccess from '../components/UploadSuccess.vue';

describe('UploadSuccess', () => {
  it('renders correctly', () => {
    const wrapper = mount(UploadSuccess);

    // Verify the main section title
    const sectionTitle = wrapper.find('.upload-success-title');
    expect(sectionTitle.exists()).toBe(true);
    expect(sectionTitle.text()).toBe('Import Files');

    // Verify the success heading and detail message
    const successHeading = wrapper.find('.success-heading');
    const successDetail = wrapper.find('.success-detail');

    expect(successHeading.exists()).toBe(true);
    expect(successHeading.text()).toBe('SUCCESS');

    expect(successDetail.exists()).toBe(true);
    expect(successDetail.text()).toBe('Imported file successfully');
  });

  it('has accessible buttons', () => {
    const wrapper = mount(UploadSuccess);

    const cancelButton = wrapper.find('.cancel-btn');
    const importButton = wrapper.find('.import-btn');

    expect(cancelButton.exists()).toBe(true);
    expect(cancelButton.text()).toBe('Cancel');

    expect(importButton.exists()).toBe(true);
    expect(importButton.text()).toBe('Import');
  });

  it('contains success message and prompt', () => {
    const wrapper = mount(UploadSuccess);

    expect(wrapper.find('.success-heading').text()).toBe('SUCCESS');
    expect(wrapper.find('.success-detail').text()).toBe('Imported file successfully');
    expect(wrapper.find('.success-prompt').text()).toBe('Would you like to import more files?');
  });


  it('has action buttons', () => {
    const wrapper = mount(UploadSuccess);

    expect(wrapper.find('.cancel-btn').exists()).toBe(true);
    expect(wrapper.find('.import-btn').exists()).toBe(true);
  });
});
