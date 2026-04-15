import { render, screen, fireEvent } from '@testing-library/react'
import RulesAdvisor from '../components/RulesAdvisor'

function selectSituation(id) {
  fireEvent.change(screen.getByLabelText('Select Situation'), { target: { value: id } })
}

describe('RulesAdvisor — all situations show correct rule reference', () => {
  beforeEach(() => render(<RulesAdvisor />))

  const cases = [
    ['penalty-area',      'Rule 17'],
    ['out-of-bounds',     'Rule 18.2'],
    ['unplayable',        'Rule 19'],
    ['temp-water',        'Rule 16.1'],
    ['cart-path',         'Rule 16.1'],
    ['lost-ball',         'Rule 18.2'],
    ['wrong-ball',        'Rule 6.3c'],
    ['embedded',          'Rule 16.3'],
    ['loose-impediments', 'Rule 15.1'],
    ['wrong-green',       'Rule 13.1f'],
  ]

  test.each(cases)('%s → %s', (id, expectedRule) => {
    selectSituation(id)
    expect(screen.getByText(expectedRule)).toBeInTheDocument()
  })
})

describe('RulesAdvisor — situation headings', () => {
  beforeEach(() => render(<RulesAdvisor />))

  const cases = [
    ['penalty-area',      'Ball in Penalty Area (Water Hazard)'],
    ['out-of-bounds',     'Out of Bounds'],
    ['unplayable',        'Unplayable Lie'],
    ['temp-water',        'Temporary Water (Casual Water)'],
    ['cart-path',         'Ball on Cart Path / Immovable Obstruction'],
    ['lost-ball',         'Lost Ball'],
    ['wrong-ball',        'Wrong Ball Played'],
    ['embedded',          'Embedded Ball (Plugged Lie)'],
    ['loose-impediments', 'Loose Impediments (Leaves, Twigs, etc.)'],
    ['wrong-green',       'Ball on Wrong Putting Green'],
  ]

  test.each(cases)('%s shows heading "%s"', (id, heading) => {
    selectSituation(id)
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })
})

describe('RulesAdvisor — UI state', () => {
  it('shows the placeholder hint on initial render', () => {
    render(<RulesAdvisor />)
    expect(screen.getByText('Select a situation to get rules guidance.')).toBeInTheDocument()
  })

  it('hides the hint once a situation is selected', () => {
    render(<RulesAdvisor />)
    selectSituation('lost-ball')
    expect(screen.queryByText('Select a situation to get rules guidance.')).not.toBeInTheDocument()
  })

  it('restores the hint when selection is cleared', () => {
    render(<RulesAdvisor />)
    selectSituation('lost-ball')
    selectSituation('')
    expect(screen.getByText('Select a situation to get rules guidance.')).toBeInTheDocument()
  })

  it('replaces advice when a different situation is selected', () => {
    render(<RulesAdvisor />)
    selectSituation('penalty-area')
    expect(screen.getByText('Rule 17')).toBeInTheDocument()

    selectSituation('wrong-ball')
    expect(screen.queryByText('Rule 17')).not.toBeInTheDocument()
    expect(screen.getByText('Rule 6.3c')).toBeInTheDocument()
  })
})

describe('RulesAdvisor — advice content keywords', () => {
  beforeEach(() => render(<RulesAdvisor />))

  it('penalty area advice mentions stroke and distance', () => {
    selectSituation('penalty-area')
    expect(screen.getByText(/stroke and distance/i)).toBeInTheDocument()
  })

  it('lost ball advice mentions 3 minutes', () => {
    selectSituation('lost-ball')
    expect(screen.getByText(/3 minutes/i)).toBeInTheDocument()
  })

  it('temp water advice mentions free relief', () => {
    selectSituation('temp-water')
    expect(screen.getByText(/free relief/i)).toBeInTheDocument()
  })

  it('wrong ball stroke play advice mentions 2-stroke penalty', () => {
    selectSituation('wrong-ball')
    expect(screen.getByText(/2-stroke penalty/i)).toBeInTheDocument()
  })
})
