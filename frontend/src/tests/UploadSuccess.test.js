import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import UploadSuccess from '../UploadSuccess.vue'

describe('UploadSuccess', () => {
  it('renders correctly', () => {
    const wrapper = mount(UploadSuccess)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.organization-title').text()).toBe('USD Office of Sustainability')
    expect(wrapper.find('.greeting').text()).toBe('Hi, John')
  })

  it('has accessible buttons', () => {
    const wrapper = mount(UploadSuccess)
    const buttons = wrapper.findAll('button')
    buttons.forEach(button => {
      expect(button.attributes('tabindex')).toBe('0')
    })
  })

  it('contains success message', () => {
    const wrapper = mount(UploadSuccess)
    expect(wrapper.find('.success-heading').text()).toBe('SUCCESS')
    expect(wrapper.find('.success-description').text()).toBe('Imported 2 files successfully')
  })

  it('has action buttons', () => {
    const wrapper = mount(UploadSuccess)
    expect(wrapper.find('.cancel-button').exists()).toBe(true)
    expect(wrapper.find('.import-button').exists()).toBe(true)
  })
})