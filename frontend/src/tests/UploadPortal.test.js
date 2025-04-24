import { mount } from '@vue/test-utils';  
import { vi } from 'vitest';
import { nextTick } from 'vue';
import UploadData from '../components/UploadData.vue'; 
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

// Mocking axios
vi.mock('axios');

// Mocking useRoute and useRouter hooks
vi.mock('vue-router', () => ({
  useRoute: () => ({
    path: '/upload', // Simulate a path in the route object
  }),
  useRouter: () => ({
    push: vi.fn() // Mock the router's push method
  })
}));

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
    wrapper = mount(UploadData, {
      global: {
        mocks: {
          $route: {
            path: '/upload', // or whatever your component expects
          },
          $router: {
            push: vi.fn(),
          },
        },
      },
    });
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
    wrapper = mount(UploadData);
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
    expect(axios.post).toHaveBeenCalledWith(
      `http://localhost:3000/api/auth/${endpoint}`,
      expect.any(FormData),
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
  });
});
