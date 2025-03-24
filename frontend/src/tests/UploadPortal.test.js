import { mount } from '@vue/test-utils';  
import axios from 'axios';
import { vi } from 'vitest';
import { nextTick } from 'vue';
import UploadData from '../components/UploadData.vue'; 

// Mock axios
vi.mock('axios');

// Helper function to create a valid FileList
function createFileList(file) {
  const fileList = { length: 1, 0: file };
  Object.defineProperty(fileList, 'item', {
    value: (index) => fileList[index],
  });
  return fileList;
}

describe('UploadData.vue', () => {
  let wrapper;

  // Before each test, mount the component
  beforeEach(() => {
    wrapper = mount(UploadData);
  });

  test('file selection updates uploaded file name and triggers backend upload', async () => {
    // Create a mock file
    const file = new File(['dummy content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Find the file input element
    const fileInput = wrapper.find('input[type="file"]');

    // Use the helper to create a valid FileList
    const fileList = createFileList(file);

    // Mock setting the files property using Object.defineProperty
    const inputElement = fileInput.element;
    Object.defineProperty(inputElement, 'files', {
      value: fileList,
    });

    // Trigger the change event to simulate file selection
    await fileInput.trigger('change');

    // Wait for Vue to process the file selection
    await nextTick();

    // Ensure the file name has been updated in the component's data
    expect(wrapper.vm.uploadedFileName).toBe('test.xlsx');

    // Mock the backend API call
    axios.post.mockResolvedValue({ status: 200 });

    // Trigger the upload function
    await wrapper.vm.handleUpload();

    // Ensure that the backend upload was triggered
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/api/auth/file-upload', expect.any(FormData), {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  });
});
