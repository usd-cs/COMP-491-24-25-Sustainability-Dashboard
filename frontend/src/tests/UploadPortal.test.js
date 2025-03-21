import { mount } from '@vue/test-utils';
import axios from 'axios';
import { vi } from 'vitest';
import UploadData from '@/components/UploadData.vue';

vi.mock('axios'); // Mock axios globally

describe('UploadData.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(UploadData);
    vi.clearAllMocks(); // Reset mocks before each test
  });

  test('renders upload portal correctly', () => {
    expect(wrapper.find('.upload-portal').exists()).toBe(true);
    expect(wrapper.find('.upload-title').text()).toBe('Import Files');
  });

  test('file selection updates uploaded file name', async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const file = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Simulate file selection
    await fileInput.setValue(file);

    expect(wrapper.vm.uploadedFileName).toBe('test.xlsx');
  });

  test('uploads file and updates UI on success', async () => {
    const file = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Simulate file selection
    wrapper.vm.selectedFile = file;
    wrapper.vm.uploadedFileName = file.name;

    // Mock API response
    axios.post.mockResolvedValue({ status: 200 });

    // Trigger upload
    await wrapper.vm.handleUpload();

    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:3000/api/auth/file-upload',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    // Ensure UI updates
    expect(wrapper.vm.uploadedFileName).toBe('test.xlsx');
  });

  test('handles file upload failure', async () => {
    const file = new File(['dummy content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    wrapper.vm.selectedFile = file;

    axios.post.mockRejectedValue(new Error('Upload failed'));

    window.alert = vi.fn(); // Mock alert

    await wrapper.vm.handleUpload();

    expect(window.alert).toHaveBeenCalledWith('File upload failed. Please try again.');
  });

  test('verifies database entry after upload', async () => {
    const request = (await import('supertest')).default;
    const app = (await import('@/server')).default; // Adjust server path

    const response = await request(app).get('/api/data'); // API to check uploaded data

    expect(response.status).toBe(200);
    expect(response.body).toContainEqual({ filename: 'test.xlsx', status: 'Processed' });
  });
});
