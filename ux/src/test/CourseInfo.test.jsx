import { render, screen, fireEvent } from '@testing-library/react'
import CourseInfo from '../components/CourseInfo'

function renderCourse(overrides = {}) {
  const defaults = { name: '', hole: 1, par: 4 }
  const course = { ...defaults, ...overrides }
  const onChange = vi.fn()
  render(<CourseInfo course={course} onChange={onChange} />)
  return { onChange, course }
}

describe('CourseInfo — initial render', () => {
  it('renders the section heading', () => {
    renderCourse()
    expect(screen.getByRole('heading', { name: 'Course Information' })).toBeInTheDocument()
  })

  it('does not show the badge when course name is empty', () => {
    renderCourse({ name: '' })
    expect(screen.queryByText(/Hole \d/)).not.toBeInTheDocument()
  })

  it('shows all 18 hole options', () => {
    renderCourse()
    const select = screen.getByLabelText('Hole')
    expect(select.options).toHaveLength(18)
    expect(select.options[0].value).toBe('1')
    expect(select.options[17].value).toBe('18')
  })

  it('shows par options 3, 4, and 5', () => {
    renderCourse()
    const select = screen.getByLabelText('Par')
    const values = Array.from(select.options).map(o => o.value)
    expect(values).toEqual(['3', '4', '5'])
  })
})

describe('CourseInfo — course badge', () => {
  it('shows badge with course name, hole, and par when name is set', () => {
    renderCourse({ name: 'Pebble Beach', hole: 7, par: 3 })
    const badge = screen.getByText(/Pebble Beach/)
    expect(badge).toBeInTheDocument()
    expect(badge.textContent).toMatch(/Hole 7/)
    expect(badge.textContent).toMatch(/Par 3/)
  })

  it('badge disappears when name is cleared', () => {
    const { onChange } = renderCourse({ name: 'Augusta' })
    expect(screen.getByText(/Augusta/)).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('e.g. Augusta National'), {
      target: { value: '' },
    })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: '' }))
  })
})

describe('CourseInfo — onChange callbacks', () => {
  it('calls onChange with updated name', () => {
    const { onChange } = renderCourse()
    fireEvent.change(screen.getByPlaceholderText('e.g. Augusta National'), {
      target: { value: 'St Andrews' },
    })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'St Andrews' }))
  })

  it('calls onChange with updated hole number', () => {
    const { onChange } = renderCourse()
    fireEvent.change(screen.getByLabelText('Hole'), { target: { value: '9' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ hole: 9 }))
  })

  it('calls onChange with updated par', () => {
    const { onChange } = renderCourse()
    fireEvent.change(screen.getByLabelText('Par'), { target: { value: '5' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ par: 5 }))
  })

  it('preserves other fields when one field changes', () => {
    const { onChange } = renderCourse({ name: 'Muirfield', hole: 3, par: 4 })
    fireEvent.change(screen.getByLabelText('Par'), { target: { value: '3' } })
    expect(onChange).toHaveBeenCalledWith({ name: 'Muirfield', hole: 3, par: 3 })
  })
})
