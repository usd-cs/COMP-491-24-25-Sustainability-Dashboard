import { mount } from '@vue/test-utils';
import { vi } from 'vitest';
import UploadButton from '../components/UploadButton.vue';

// Mocking the useRouter hook from vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

describe('UploadButton.vue', () => {
  test('navigates to /select when upload button is clicked', async () => {
    const { useRouter } = await import('vue-router');
    
    const mockRouterPush = vi.fn();
    useRouter.mockReturnValue({ push: mockRouterPush });

    const wrapper = mount(UploadButton);
    
    // Find the button and trigger a click event
    const uploadButton = wrapper.find('.upload-btn');
    await uploadButton.trigger('click');

    // Assert that the router push method was called with the correct path
    expect(mockRouterPush).toHaveBeenCalledWith('/select');
  });
});
