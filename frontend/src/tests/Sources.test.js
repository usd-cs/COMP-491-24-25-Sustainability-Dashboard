import { render, fireEvent } from '@testing-library/vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Sources from '../components/Sources.vue'


// Mock router
const push = vi.fn()

vi.mock('vue-router', () => {
  return {
    useRouter: () => ({
      push
    }),
    useRoute: () => ({
      path: '/mock-path', // Mocked route path
      query: {} // Mocked query parameters
    })
  }
})

describe('Sources.vue', () => {
  let getByText

  beforeEach(() => {
    const utils = render(Sources)
    getByText = utils.getByText
  })

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
    const card = getByText('Alcala Borrego')
    await fireEvent.click(card)
    expect(push).toHaveBeenCalledWith({
      path: '/sources-graph',
      query: { buildingName: 'alcala_borrego' }
    })
  })

  it('navigates via nav buttons', async () => {
    await fireEvent.click(getByText('Summary'))
    expect(push).toHaveBeenCalledWith('/main')

    await fireEvent.click(getByText('Sources'))
    expect(push).toHaveBeenCalledWith('/sources')

    await fireEvent.click(getByText('Initiatives'))
    expect(push).toHaveBeenCalledWith('/initiatives')

  })

  it('logs out when logout button is clicked', async () => {
    const logoutBtn = getByText('Logout →')
    await fireEvent.click(logoutBtn)
    expect(push).toHaveBeenCalledWith('/')
  })
})
