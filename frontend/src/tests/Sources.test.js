import { render, fireEvent } from '@testing-library/vue'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Sources from '../components/Sources.vue'

const routes = [
  { path: '/', component: { template: '<div>Summary</div>' } },
  { path: '/sources', component: { template: '<div>Sources</div>' } },
  { path: '/initiatives', component: { template: '<div>Initiatives</div>' } },
  { path: '/sources-graph', component: { template: '<div>Graph</div>' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

describe('Sources.vue', () => {
  let getByText, getAllByText;
  let pushSpy;

  beforeEach(async() => {
    pushSpy = vi.spyOn(router, 'push');
    const utils = render(Sources, {
      global: {
        plugins: [router]
      }
    });
    getByText = utils.getByText
    getAllByText = utils.getAllByText
    // Wait for the router to be ready
    await router.isReady();
  });

  it('renders the logo and nav items', () => {
    expect(getByText('Summary')).toBeTruthy()
    expect(getByText('Sources')).toBeTruthy()
    expect(getByText('Initiatives')).toBeTruthy()
    expect(getByText('Logout →')).toBeTruthy()
  })

  it('displays filtered buildings correctly', () => {
    const building = getByText('Alcala Borrego')
    expect(building).toBeTruthy()
  })

  it('changes filter when button clicked', async () => {
    const fuelBtn = getByText('Fuelcell')
    await fireEvent.click(fuelBtn)
    expect(getByText('Fuelcell Buildings')).toBeTruthy()
  })

  it('navigates to building graph on card click', async () => {
    const card = getByText('Alcala Borrego');
    await fireEvent.click(card);
    expect(pushSpy).toHaveBeenCalledWith({
      path: '/sources-graph',
      query: { buildingName: 'alcala_borrego' }
    });
  });

  it('navigates via nav buttons', async () => {
    await fireEvent.click(getByText('Summary'))
    expect(pushSpy).toHaveBeenCalledWith('/')

    await fireEvent.click(getByText('Sources'))
    expect(pushSpy).toHaveBeenCalledWith('/sources')

    await fireEvent.click(getByText('Initiatives'))
    expect(pushSpy).toHaveBeenCalledWith('/initiatives')

  })

  it('logs out when logout button is clicked', async () => {
    const logoutBtn = getByText('Logout →')
    await fireEvent.click(logoutBtn)
    expect(pushSpy).toHaveBeenCalledWith('/')
  })
})
