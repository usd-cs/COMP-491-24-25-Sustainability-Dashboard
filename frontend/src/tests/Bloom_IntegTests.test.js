/**
 * @file Bloom_IntegTests.test.js
 * @description
 * Frontend integration tests for the FileImport.vue component using Vitest and Vue Test Utils.
 * 
 * These tests verify:
 * - Correct fetching and display of Athena and Bloom timestamps from the backend (mocked with axios)
 * - Graceful handling and display when API errors occur
 * - State updates when a source is selected
 * 
 * External dependencies such as axios and Vue Router are mocked or stubbed as needed.
 */
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FileImport from '../components/FileImport.vue'
import axios from 'axios'
import { createRouter, createWebHistory } from 'vue-router'

vi.mock('axios')

describe('FileImport.vue integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('fetches and displays Athena and Bloom timestamps', async () => {
    // Mock API responses for Athena and Bloom
    axios.get
      .mockResolvedValueOnce({ data: { timestamp: 1715000000000 } }) // Athena
      .mockResolvedValueOnce({ data: { timestamp: 1716000000000 } }) // Bloom

    const wrapper = mount(FileImport, {
      global: {
        stubs: {
          AppLayout: { template: '<div><slot /></div>' }
        }
      }
    })

    // Wait for onMounted and axios calls to resolve
    await new Promise(resolve => setTimeout(resolve, 0))

    // Check that the timestamps are rendered
    expect(wrapper.html()).toContain('Last updated:') // At least one
    expect(wrapper.html()).toContain(new Date(1715000000000).toLocaleString('en-US'))
    expect(wrapper.html()).toContain(new Date(1716000000000).toLocaleString('en-US'))
  })

  it('handles API error gracefully', async () => {
    axios.get.mockRejectedValueOnce(new Error('API error')).mockRejectedValueOnce(new Error('API error'))

    const wrapper = mount(FileImport, {
      global: {
        stubs: {
          AppLayout: { template: '<div><slot /></div>' }
        }
      }
    })

    // Wait for error handling
    await new Promise(resolve => setTimeout(resolve, 0))

    // Check for "invalid date" as a sign of API error
    expect(wrapper.html()).toContain('Last updated: N/A')
  })

  it('updates selectedSource when a source is clicked', async () => {
  const wrapper = mount(FileImport, {
    global: {
      stubs: {
        AppLayout: { template: '<div><slot /></div>' }
      }
    }
  })

  // Find the Bloom source label and click it
  const bloomLabel = wrapper.find('label.source-option')
  expect(bloomLabel.exists()).toBe(true)
  await bloomLabel.trigger('click')

  // Check that the selectedSource is updated
  expect(wrapper.vm.selectedSource).toBe('Athena')
  })  
    
  it('navigates to upload page when a source is selected', async () => {
    axios.get
      .mockResolvedValueOnce({ data: { timestamp: 1715000000000 } })
      .mockResolvedValueOnce({ data: { timestamp: 1716000000000 } })

    // Create a real router instance
    const router = createRouter({
      history: createWebHistory(),
      routes: []
    })
    // Spy on push
    router.push = vi.fn()

    const wrapper = mount(FileImport, {
      global: {
        stubs: {
          AppLayout: { template: '<div><slot /></div>' }
        },
        plugins: [router]
      }
    })

    await new Promise(resolve => setTimeout(resolve, 0))

        // Find the submit button by its class
    const submitBtn = wrapper.find('button.source-selector__submit')
    expect(submitBtn.exists()).toBe(true)
    await submitBtn.trigger('click')
    expect(router.push).toHaveBeenCalled()
    })
})