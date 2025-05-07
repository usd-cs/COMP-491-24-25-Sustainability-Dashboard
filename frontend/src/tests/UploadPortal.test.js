/**
 * @file UploadPortal.test.js
 * @description Integration tests for `UploadData` component using Vitest and Vue Test Utils.
 */
import { mount } from '@vue/test-utils';  
import axios from 'axios';
import { expect,vi } from 'vitest';
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

  beforeEach(() => {
    // Clear any previous mock implementations
    vi.clearAllMocks();
    
    // Reset the wrapper
    wrapper = null;
  });

  test.each([
    ['Excel', 'test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'file-upload'],
    ['Athena', 'test.csv', 'text/csv', 'athena-upload']
  ])('handles %s file upload correctly', async (sourceType, filename, mimeType, endpoint) => {
    // Set up localStorage mock before mounting
    const getItemMock = vi.fn((key) => {
      if (key === 'selectedSource') return sourceType;
      return null;
    });
    Storage.prototype.getItem = getItemMock;

    // Mount component after setting up localStorage
    wrapper = mount(UploadData, {
      global: {
          stubs: {
              AppLayout: {
                  template: '<div><slot /></div>'
              },
              NavBar: true,
              'router-link': true
          }
      }
    });
    await nextTick();

    // Create a mock file
    const file = new File(['dummy content'], filename, { type: mimeType });
    const fileList = createFileList(file);

    // Find and trigger file input
    const fileInput = wrapper.find('input[type="file"]');
    Object.defineProperty(fileInput.element, 'files', {
      value: fileList
    });
    await fileInput.trigger('change');
    await nextTick();

    // Check filename update
    expect(wrapper.vm.uploadedFileName).toBe(filename);

    // Mock successful API response
    axios.post.mockResolvedValue({ status: 200 });

    // Trigger upload
    await wrapper.vm.handleUpload();

    // Verify correct endpoint was called
    const apiUrl = import.meta.env.VITE_API_URL;
    expect(axios.post).toHaveBeenCalledWith(
      `${apiUrl}/api/auth/${endpoint}`,
      expect.any(FormData),
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
  });
});
