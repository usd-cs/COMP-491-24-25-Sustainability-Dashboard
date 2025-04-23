import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import SourcesGraph from '../components/SourcesGraph.vue';
import axios from 'axios';
import * as echarts from 'echarts';

// ✅ Mock useRoute and useRouter from vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {
      buildingName: 'alcala_borrego'
    }
  }),
  useRouter: () => ({
    push: vi.fn()
  })
}));

// ✅ Mock axios
vi.mock('axios');

// ✅ Mock echarts
const setOptionMock = vi.fn();
vi.mock('echarts', () => ({
  init: vi.fn(() => ({
    setOption: setOptionMock,
    getOption: () => ({
      series: []
    })
  })),
  getInstanceByDom: vi.fn(() => ({
    setOption: setOptionMock,
    getOption: () => ({
      series: []
    })
  }))
}));

const mockResponse = [
  { timestamp: '2024-04-10T10:00:00', energy_output: 100 },
  { timestamp: '2024-04-10T11:00:00', energy_output: 120 }
];

describe('SourcesGraph.vue', () => {
  beforeEach(() => {
    setOptionMock.mockClear();
    axios.get.mockClear();
    axios.get.mockResolvedValue({ data: mockResponse });
  });

  it('renders chart with data for the selected building', async () => {
    const wrapper = mount(SourcesGraph);

    await flushPromises();

    expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
      params: { buildingName: 'alcala_borrego' }
    });
    expect(setOptionMock).toHaveBeenCalled();
    expect(wrapper.text()).not.toContain('No data available');
  });

  it('shows no data message when no data is returned', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const wrapper = mount(SourcesGraph);

    await flushPromises();
    expect(wrapper.text()).toContain('No data available for the selected building.');
  });

  it('shows dropdown when Compare button is clicked', async () => {
    const wrapper = mount(SourcesGraph);

    await flushPromises();

    const button = wrapper.find('button.comp-btn');
    await button.trigger('click');

    expect(wrapper.find('select').exists()).toBe(true);
  });

  it('fetches data for the second building and updates chart', async () => {
    const wrapper = mount(SourcesGraph);

    await flushPromises();

    // Show dropdown
    await wrapper.find('button.comp-btn').trigger('click');

    // Select second building
    const select = wrapper.find('select');
    await select.setValue('Camino Hall');
    await select.trigger('change');

    await flushPromises();

    expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
      params: { buildingName: 'camino_hall' }
    });

    expect(setOptionMock).toHaveBeenCalled();
  });
});
