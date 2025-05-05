/**
 * @file Sources.test.js
 * @description Unit tests for the `Sources` component using Vitest and Testing Library for Vue.
 */
import { render, fireEvent } from '@testing-library/vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Sources from '../components/Sources.vue'

// Stubbed AppLayout that just renders the nav buttons + slot
const AppLayoutStub = {
  template: `
    <div>
      <button @click="$router.push('/')">Summary</button>
      <button @click="$router.push('/sources')">Sources</button>
      <button @click="$router.push('/initiatives')">Initiatives</button>
      <slot />
    </div>
  `,
};

const routes = [
  { path: '/', component: { template: '<div>Summary Page</div>' } },
  { path: '/sources', component: { template: '<div>Sources Page</div>' } },
  { path: '/initiatives', component: { template: '<div>Initiatives Page</div>' } },
  { path: '/sources-graph', component: { template: '<div>Graph</div>' } }
];

describe('Sources.vue', () => {
  let getByText;
  let routerPush;

  beforeEach(async () => {
    // 1) create a fresh router per test using memory history
    const router = createRouter({
      history: createMemoryHistory(),
      routes,
    });

    // 2) spy on its push method
    routerPush = vi.spyOn(router, 'push');

    // 3) render Sources with our stubbed layout
    const utils = render(Sources, {
      global: {
        plugins: [router],
        stubs: { AppLayout: AppLayoutStub },
      },
    });
    getByText = utils.getByText;

    // wait until the router is ready
    await router.isReady();
  });

  it('renders the page title correctly', () => {
    expect(getByText('All Solar Sites')).toBeTruthy();
  });

  it('displays all solar buildings with correct panel counts', () => {
    expect(getByText('Kroc')).toBeTruthy();
    expect(getByText('512 panels')).toBeTruthy();

    expect(getByText('Camino Hall')).toBeTruthy();
    expect(getByText('980 panels')).toBeTruthy();
  });

  it('navigates to building graph on card click', async () => {
    const card = getByText('Alcala Borrego').closest('article');
    await fireEvent.click(card);
    expect(routerPush).toHaveBeenCalledWith({
      path: '/sources-graph',
      query: { buildingName: 'alcala_borrego' }
    });
  });

  it('handles special case for Soles/MRH navigation', async () => {
    const card = getByText('Soles/MRH').closest('article');
    await fireEvent.click(card);
    expect(routerPush).toHaveBeenCalledWith({
      path: '/sources-graph',
      query: { buildingName: 'soles' }
    });
  });

  it('navigates via nav buttons', async () => {
    await fireEvent.click(getByText('Summary'));
    expect(routerPush).toHaveBeenCalledWith('/');

    await fireEvent.click(getByText('Sources'));
    expect(routerPush).toHaveBeenCalledWith('/sources');

    await fireEvent.click(getByText('Initiatives'));
    expect(routerPush).toHaveBeenCalledWith('/initiatives');
  });
});
