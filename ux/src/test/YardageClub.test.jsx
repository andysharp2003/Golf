import { render, screen, fireEvent } from '@testing-library/react'
import YardageClub from '../components/YardageClub'

const noWind = { windSpeed: '', windDirection: 'N' }

function renderYardage(yardage = '', weather = noWind) {
  const onChange = vi.fn()
  render(<YardageClub yardage={yardage} onYardageChange={onChange} weather={weather} />)
  return { onChange }
}

// ── Club boundary values ──────────────────────────────────────────────────────

describe('YardageClub — club boundaries', () => {
  const cases = [
    [5,   'Putter'],
    [6,   'Lob Wedge'],
    [60,  'Lob Wedge'],
    [61,  'Sand Wedge'],
    [80,  'Sand Wedge'],
    [81,  'Gap Wedge'],
    [95,  'Gap Wedge'],
    [96,  'Pitching Wedge'],
    [110, 'Pitching Wedge'],
    [111, '9 Iron'],
    [120, '9 Iron'],
    [121, '8 Iron'],
    [130, '8 Iron'],
    [131, '7 Iron'],
    [140, '7 Iron'],
    [141, '6 Iron'],
    [150, '6 Iron'],
    [151, '5 Iron'],
    [160, '5 Iron'],
    [161, '4 Iron / 4 Hybrid'],
    [170, '4 Iron / 4 Hybrid'],
    [171, '3 Hybrid'],
    [183, '3 Hybrid'],
    [184, '5 Wood'],
    [200, '5 Wood'],
    [201, '3 Wood'],
    [220, '3 Wood'],
    [221, 'Driver'],
    [350, 'Driver'],
  ]

  test.each(cases)('%i yards → %s', (yards, expected) => {
    renderYardage(String(yards))
    expect(screen.getByText(expected)).toBeInTheDocument()
  })
})

// ── Short abbreviation ────────────────────────────────────────────────────────

describe('YardageClub — short codes', () => {
  const cases = [
    [60,  'LW'],
    [80,  'SW'],
    [95,  'GW'],
    [100, 'PW'],
    [115, '9i'],
    [125, '8i'],
    [135, '7i'],
    [145, '6i'],
    [155, '5i'],
    [165, '4i/4h'],
    [175, '3h'],
    [190, '5w'],
    [210, '3w'],
    [250, '1w'],
  ]

  test.each(cases)('%i yards shows short code %s', (yards, short) => {
    renderYardage(String(yards))
    expect(screen.getByText(short)).toBeInTheDocument()
  })
})

// ── Empty / invalid yardage ───────────────────────────────────────────────────

describe('YardageClub — no recommendation', () => {
  it('shows hint when yardage is empty', () => {
    renderYardage('')
    expect(screen.getByText('Enter the distance to get a club recommendation.')).toBeInTheDocument()
  })

  it('shows hint when yardage is zero', () => {
    renderYardage('0')
    expect(screen.getByText('Enter the distance to get a club recommendation.')).toBeInTheDocument()
  })

  it('does not show a club name when yardage is empty', () => {
    renderYardage('')
    expect(screen.queryByText('Recommended Club')).not.toBeInTheDocument()
  })
})

// ── Wind tips ─────────────────────────────────────────────────────────────────

describe('YardageClub — wind tips', () => {
  it('shows no wind tip when wind speed is empty', () => {
    renderYardage('150', { windSpeed: '', windDirection: 'N' })
    expect(screen.queryByText(/breeze|headwind|bump/i)).not.toBeInTheDocument()
  })

  it('shows no wind tip when wind speed is 0', () => {
    renderYardage('150', { windSpeed: '0', windDirection: 'N' })
    expect(screen.queryByText(/breeze|headwind|bump/i)).not.toBeInTheDocument()
  })

  it('shows light breeze tip for 5 mph', () => {
    renderYardage('150', { windSpeed: '5', windDirection: 'N' })
    expect(screen.getByText(/minimal adjustment/i)).toBeInTheDocument()
  })

  it('shows moderate wind tip for 10 mph', () => {
    renderYardage('150', { windSpeed: '10', windDirection: 'N' })
    expect(screen.getByText(/club up 1 for headwind/i)).toBeInTheDocument()
  })

  it('shows strong wind tip for 20 mph', () => {
    renderYardage('150', { windSpeed: '20', windDirection: 'N' })
    expect(screen.getByText(/club up 1–2/i)).toBeInTheDocument()
  })

  it('shows very strong wind tip for 21+ mph', () => {
    renderYardage('150', { windSpeed: '25', windDirection: 'N' })
    expect(screen.getByText(/club up 2–3/i)).toBeInTheDocument()
  })

  it('does not show wind tip when no yardage is entered', () => {
    renderYardage('', { windSpeed: '20', windDirection: 'N' })
    expect(screen.queryByText(/headwind/i)).not.toBeInTheDocument()
  })
})

// ── onChange callback ─────────────────────────────────────────────────────────

describe('YardageClub — input interaction', () => {
  it('calls onYardageChange when input changes', () => {
    const { onChange } = renderYardage('')
    fireEvent.change(screen.getByLabelText('Yards to Hole'), { target: { value: '180' } })
    expect(onChange).toHaveBeenCalledWith('180')
  })
})
