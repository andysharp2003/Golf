import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
  })

  it('renders the Golf Caddie header', () => {
    render(<App />)
    expect(screen.getByText('Golf Caddie')).toBeInTheDocument()
    expect(screen.getByText('Your on-course companion')).toBeInTheDocument()
  })

  it('renders all four section headings', () => {
    render(<App />)
    expect(screen.getByText('Course Information')).toBeInTheDocument()
    expect(screen.getByText('Weather Conditions')).toBeInTheDocument()
    expect(screen.getByText(/Yardage/)).toBeInTheDocument()
    expect(screen.getByText('Rules Advisor')).toBeInTheDocument()
  })
})

describe('CourseInfo', () => {
  it('updates course name input', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('e.g. Augusta National')
    fireEvent.change(input, { target: { value: 'Pebble Beach' } })
    expect(input.value).toBe('Pebble Beach')
  })

  it('shows course badge when name is entered', () => {
    render(<App />)
    const input = screen.getByPlaceholderText('e.g. Augusta National')
    fireEvent.change(input, { target: { value: 'St Andrews' } })
    expect(screen.getByText(/St Andrews/)).toBeInTheDocument()
  })

  it('defaults to hole 1 and par 4', () => {
    render(<App />)
    expect(screen.getByLabelText('Hole').value).toBe('1')
    expect(screen.getByLabelText('Par').value).toBe('4')
  })
})

describe('WeatherCard', () => {
  it('renders temperature and condition inputs', () => {
    render(<App />)
    expect(screen.getByLabelText(/Temperature/)).toBeInTheDocument()
    expect(screen.getByLabelText('Condition')).toBeInTheDocument()
  })

  it('renders wind speed and direction controls', () => {
    render(<App />)
    expect(screen.getByLabelText(/Speed/)).toBeInTheDocument()
    expect(screen.getByLabelText('Direction')).toBeInTheDocument()
  })

  it('updates wind direction and reflects in compass label', () => {
    render(<App />)
    const dirSelect = screen.getByLabelText('Direction')
    fireEvent.change(dirSelect, { target: { value: 'SW' } })
    expect(screen.getByText('From SW')).toBeInTheDocument()
  })
})

describe('YardageClub', () => {
  it('shows placeholder hint when no yardage entered', () => {
    render(<App />)
    expect(screen.getByText('Enter the distance to get a club recommendation.')).toBeInTheDocument()
  })

  it('recommends 7 Iron for 135 yards', () => {
    render(<App />)
    const input = screen.getByLabelText('Yards to Hole')
    fireEvent.change(input, { target: { value: '135' } })
    expect(screen.getByText('7 Iron')).toBeInTheDocument()
  })

  it('recommends Driver for 250 yards', () => {
    render(<App />)
    const input = screen.getByLabelText('Yards to Hole')
    fireEvent.change(input, { target: { value: '250' } })
    expect(screen.getByText('Driver')).toBeInTheDocument()
  })

  it('recommends Pitching Wedge for 100 yards', () => {
    render(<App />)
    const input = screen.getByLabelText('Yards to Hole')
    fireEvent.change(input, { target: { value: '100' } })
    expect(screen.getByText('Pitching Wedge')).toBeInTheDocument()
  })

  it('shows wind tip when wind speed is set and yardage is entered', () => {
    render(<App />)
    fireEvent.change(screen.getByLabelText('Yards to Hole'), { target: { value: '150' } })
    fireEvent.change(screen.getByLabelText(/Speed/), { target: { value: '15' } })
    expect(screen.getByText(/headwind/i)).toBeInTheDocument()
  })
})

describe('RulesAdvisor', () => {
  it('shows placeholder hint when no situation selected', () => {
    render(<App />)
    expect(screen.getByText('Select a situation to get rules guidance.')).toBeInTheDocument()
  })

  it('displays advice when a situation is selected', () => {
    render(<App />)
    const select = screen.getByLabelText('Select Situation')
    fireEvent.change(select, { target: { value: 'penalty-area' } })
    expect(screen.getByText('Rule 17')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ball in Penalty Area (Water Hazard)' })).toBeInTheDocument()
  })

  it('updates advice when situation changes', () => {
    render(<App />)
    const select = screen.getByLabelText('Select Situation')
    fireEvent.change(select, { target: { value: 'lost-ball' } })
    expect(screen.getByText('Rule 18.2')).toBeInTheDocument()
    fireEvent.change(select, { target: { value: 'unplayable' } })
    expect(screen.getByText('Rule 19')).toBeInTheDocument()
  })
})
