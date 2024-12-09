import { mount } from '@vue/test-utils';
import UploadSuccess from '../components/UploadSuccess.vue';

describe('UploadSuccess', () => {
  it('renders correctly', () => {
    const wrapper = mount(UploadSuccess);

    expect(wrapper.find('.title').text()).toBe('USD Office of Sustainability');
    expect(wrapper.find('.greeting').text()).toBe('Hi, John');
    expect(wrapper.find('.success-heading').text()).toBe('SUCCESS');
    expect(wrapper.find('.success-detail').text()).toBe('Imported file successfully');
  });

  it('has accessible buttons', () => {
    const wrapper = mount(UploadSuccess);

    const cancelButton = wrapper.find('.cancel-btn');
    const importButton = wrapper.find('.import-btn');

    // Assert buttons exist
    expect(cancelButton.exists()).toBe(true);
    expect(importButton.exists()).toBe(true);

    // Check for other accessible attributes if aria-label is not defined
    expect(cancelButton.text()).toBe('Cancel');
    expect(importButton.text()).toBe('Import');
  });

  it('contains success message', () => {
    const wrapper = mount(UploadSuccess);

    expect(wrapper.find('.success-heading').text()).toBe('SUCCESS');
    expect(wrapper.find('.success-detail').text()).toBe('Imported file successfully');
  });

  it('has action buttons', () => {
    const wrapper = mount(UploadSuccess);

    expect(wrapper.find('.cancel-btn').exists()).toBe(true);
    expect(wrapper.find('.import-btn').exists()).toBe(true);
  });
});
