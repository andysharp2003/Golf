import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
  })

  it('displays the Hello Golf heading', () => {
    render(<App />)
    expect(screen.getByText('Hello Golf!')).toBeInTheDocument()
  })

  it('renders the heading as an h1', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Hello Golf!')
  })
})
