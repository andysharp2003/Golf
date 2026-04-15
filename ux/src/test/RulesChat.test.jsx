import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import RulesChat from '../components/RulesChat'

// ── SSE stream helper ─────────────────────────────────────────────────────────

function makeStream(chunks) {
  const lines = chunks.map(t => `data: ${JSON.stringify({ text: t })}\n\n`)
  lines.push('data: [DONE]\n\n')
  const encoded = lines.map(l => new TextEncoder().encode(l))

  let idx = 0
  const reader = {
    read: vi.fn(async () => {
      if (idx < encoded.length) return { done: false, value: encoded[idx++] }
      return { done: true, value: undefined }
    }),
  }
  return { body: { getReader: () => reader } }
}

// ── Initial render ────────────────────────────────────────────────────────────

describe('RulesChat — initial render', () => {
  it('renders the section heading', () => {
    render(<RulesChat />)
    expect(screen.getByRole('heading', { name: 'Rules Advisor' })).toBeInTheDocument()
  })

  it('shows the empty-state hint', () => {
    render(<RulesChat />)
    expect(
      screen.getByText(/Describe your situation or upload a photo/i)
    ).toBeInTheDocument()
  })

  it('renders the textarea and send button', () => {
    render(<RulesChat />)
    expect(screen.getByLabelText('Rules question')).toBeInTheDocument()
    expect(screen.getByLabelText('Send')).toBeInTheDocument()
  })

  it('send button is disabled when input is empty', () => {
    render(<RulesChat />)
    expect(screen.getByLabelText('Send')).toBeDisabled()
  })

  it('send button enables once text is entered', () => {
    render(<RulesChat />)
    fireEvent.change(screen.getByLabelText('Rules question'), {
      target: { value: 'My ball is in a penalty area' },
    })
    expect(screen.getByLabelText('Send')).not.toBeDisabled()
  })
})

// ── Sending a message ─────────────────────────────────────────────────────────

describe('RulesChat — sending a message', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => makeStream(['Rule 17 applies. ', 'Take relief.']))
    )
  })
  afterEach(() => vi.unstubAllGlobals())

  it('displays the user message immediately', async () => {
    render(<RulesChat />)
    fireEvent.change(screen.getByLabelText('Rules question'), {
      target: { value: 'Ball in water hazard' },
    })
    fireEvent.click(screen.getByLabelText('Send'))

    expect(screen.getByText('Ball in water hazard')).toBeInTheDocument()
  })

  it('clears the textarea after sending', async () => {
    render(<RulesChat />)
    const textarea = screen.getByLabelText('Rules question')
    fireEvent.change(textarea, { target: { value: 'Ball in water hazard' } })
    fireEvent.click(screen.getByLabelText('Send'))

    expect(textarea.value).toBe('')
  })

  it('hides the empty-state hint after first message', async () => {
    render(<RulesChat />)
    fireEvent.change(screen.getByLabelText('Rules question'), {
      target: { value: 'OB shot' },
    })
    fireEvent.click(screen.getByLabelText('Send'))

    expect(
      screen.queryByText(/Describe your situation/i)
    ).not.toBeInTheDocument()
  })

  it('streams and displays the assistant reply', async () => {
    render(<RulesChat />)
    fireEvent.change(screen.getByLabelText('Rules question'), {
      target: { value: 'Ball in water hazard' },
    })
    fireEvent.click(screen.getByLabelText('Send'))

    await waitFor(() =>
      expect(screen.getByText(/Rule 17 applies\. Take relief\./)).toBeInTheDocument()
    )
  })

  it('posts the correct JSON body to /api/rules', async () => {
    render(<RulesChat />)
    fireEvent.change(screen.getByLabelText('Rules question'), {
      target: { value: 'Unplayable lie' },
    })
    fireEvent.click(screen.getByLabelText('Send'))

    await waitFor(() => expect(fetch).toHaveBeenCalled())
    const [url, opts] = fetch.mock.calls[0]
    expect(url).toBe('/api/rules')
    const body = JSON.parse(opts.body)
    expect(body.messages[0]).toMatchObject({
      role: 'user',
      content: 'Unplayable lie',
    })
  })

  it('Enter key sends the message', async () => {
    render(<RulesChat />)
    const textarea = screen.getByLabelText('Rules question')
    fireEvent.change(textarea, { target: { value: 'Lost ball' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false })

    expect(screen.getByText('Lost ball')).toBeInTheDocument()
  })

  it('Shift+Enter does not send', () => {
    render(<RulesChat />)
    const textarea = screen.getByLabelText('Rules question')
    fireEvent.change(textarea, { target: { value: 'Lost ball' } })
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })

    expect(fetch).not.toHaveBeenCalled()
  })
})

// ── Network error ─────────────────────────────────────────────────────────────

describe('RulesChat — network error', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('Network failure')))
    )
  })
  afterEach(() => vi.unstubAllGlobals())

  it('shows an error message when fetch rejects', async () => {
    render(<RulesChat />)
    fireEvent.change(screen.getByLabelText('Rules question'), {
      target: { value: 'OB shot' },
    })
    fireEvent.click(screen.getByLabelText('Send'))

    await waitFor(() =>
      expect(screen.getByText(/couldn't reach the rules server/i)).toBeInTheDocument()
    )
  })
})

// ── Multi-turn conversation ───────────────────────────────────────────────────

describe('RulesChat — multi-turn', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => makeStream(['Got it.']))
    )
  })
  afterEach(() => vi.unstubAllGlobals())

  it('accumulates messages across turns', async () => {
    render(<RulesChat />)

    for (const text of ['First question', 'Follow-up question']) {
      fireEvent.change(screen.getByLabelText('Rules question'), {
        target: { value: text },
      })
      fireEvent.click(screen.getByLabelText('Send'))
      await waitFor(() =>
        expect(screen.getAllByText(/Got it\./).length).toBeGreaterThan(0)
      )
    }

    expect(screen.getByText('First question')).toBeInTheDocument()
    expect(screen.getByText('Follow-up question')).toBeInTheDocument()
  })

  it('includes prior messages in the POST body on second turn', async () => {
    render(<RulesChat />)

    fireEvent.change(screen.getByLabelText('Rules question'), {
      target: { value: 'First question' },
    })
    fireEvent.click(screen.getByLabelText('Send'))
    await waitFor(() => expect(screen.getAllByText(/Got it\./)).toHaveLength(1))

    fireEvent.change(screen.getByLabelText('Rules question'), {
      target: { value: 'Second question' },
    })
    fireEvent.click(screen.getByLabelText('Send'))

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
    const body = JSON.parse(fetch.mock.calls[1][1].body)
    expect(body.messages.length).toBeGreaterThanOrEqual(3)
  })
})
