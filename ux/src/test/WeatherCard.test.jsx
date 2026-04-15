import { render, screen, fireEvent } from '@testing-library/react'
import WeatherCard from '../components/WeatherCard'

function renderWeather(overrides = {}) {
  const defaults = { temp: '', condition: 'Sunny', windSpeed: '', windDirection: 'N' }
  const weather = { ...defaults, ...overrides }
  const onChange = vi.fn()
  render(<WeatherCard weather={weather} onChange={onChange} />)
  return { onChange, weather }
}

describe('WeatherCard — initial render', () => {
  it('renders the section heading', () => {
    renderWeather()
    expect(screen.getByRole('heading', { name: 'Weather Conditions' })).toBeInTheDocument()
  })

  it('renders temperature, condition, wind speed, and direction inputs', () => {
    renderWeather()
    expect(screen.getByLabelText(/Temperature/)).toBeInTheDocument()
    expect(screen.getByLabelText('Condition')).toBeInTheDocument()
    expect(screen.getByLabelText(/Speed/)).toBeInTheDocument()
    expect(screen.getByLabelText('Direction')).toBeInTheDocument()
  })

  it('shows all 7 weather conditions', () => {
    renderWeather()
    const select = screen.getByLabelText('Condition')
    const options = Array.from(select.options).map(o => o.value)
    expect(options).toEqual([
      'Sunny', 'Partly Cloudy', 'Overcast',
      'Light Rain', 'Heavy Rain', 'Windy', 'Foggy',
    ])
  })

  it('shows all 8 wind direction options', () => {
    renderWeather()
    const select = screen.getByLabelText('Direction')
    const options = Array.from(select.options).map(o => o.value)
    expect(options).toEqual(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'])
  })
})

describe('WeatherCard — wind compass label', () => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

  test.each(directions)('compass label shows "From %s"', direction => {
    renderWeather({ windDirection: direction })
    expect(screen.getByText(`From ${direction}`)).toBeInTheDocument()
  })
})

describe('WeatherCard — onChange callbacks', () => {
  it('calls onChange with updated temperature', () => {
    const { onChange } = renderWeather()
    fireEvent.change(screen.getByLabelText(/Temperature/), { target: { value: '68' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ temp: '68' }))
  })

  it('calls onChange with updated condition', () => {
    const { onChange } = renderWeather()
    fireEvent.change(screen.getByLabelText('Condition'), { target: { value: 'Overcast' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ condition: 'Overcast' }))
  })

  it('calls onChange with updated wind speed', () => {
    const { onChange } = renderWeather()
    fireEvent.change(screen.getByLabelText(/Speed/), { target: { value: '12' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ windSpeed: '12' }))
  })

  it('calls onChange with updated wind direction', () => {
    const { onChange } = renderWeather()
    fireEvent.change(screen.getByLabelText('Direction'), { target: { value: 'SE' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ windDirection: 'SE' }))
  })

  it('preserves other fields when wind direction changes', () => {
    const { onChange } = renderWeather({ temp: '72', condition: 'Sunny', windSpeed: '10', windDirection: 'N' })
    fireEvent.change(screen.getByLabelText('Direction'), { target: { value: 'W' } })
    expect(onChange).toHaveBeenCalledWith({
      temp: '72',
      condition: 'Sunny',
      windSpeed: '10',
      windDirection: 'W',
    })
  })
})
