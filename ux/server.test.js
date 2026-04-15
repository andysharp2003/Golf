import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

// Read the server.js file to extract and verify the system prompt
const serverPath = path.resolve('server.js')
const serverCode = fs.readFileSync(serverPath, 'utf-8')

describe('server.js — Anthropic API contract', () => {
  it('uses claude-opus-4-6 model', () => {
    expect(serverCode).toContain("model: 'claude-opus-4-6'")
  })

  it('sets max_tokens to 1024', () => {
    expect(serverCode).toContain('max_tokens: 1024')
  })

  it('extracts system prompt and validates content', () => {
    // Verify the system prompt is defined and contains key elements
    expect(serverCode).toContain('const SYSTEM_PROMPT')
    expect(serverCode).toContain('Rules of Golf (2023')
    expect(serverCode).toContain('R&A')
    expect(serverCode).toContain('USGA')
    expect(serverCode).toContain('expert golf rules official')
    expect(serverCode).toContain('rule(s) by number')
    expect(serverCode).toContain('penalty')
    expect(serverCode).toContain('photo')
    expect(serverCode).toContain('show a photo')
    expect(serverCode).toContain('Rule number')
  })

  it('sends POST requests to /api/rules', () => {
    expect(serverCode).toContain("app.post('/api/rules'")
  })

  it('validates messages array in request', () => {
    expect(serverCode).toContain('messages')
    expect(serverCode).toContain("!messages || !Array.isArray(messages)")
    expect(serverCode).toContain('messages array is required')
  })

  it('uses messages.stream for streaming', () => {
    expect(serverCode).toContain('client.messages.stream')
  })

  it('filters text_delta events', () => {
    expect(serverCode).toContain("event.delta.type === 'text_delta'")
    expect(serverCode).toContain('event.delta.text')
  })

  it('sends SSE format responses', () => {
    expect(serverCode).toContain('data:')
    expect(serverCode).toContain('text:')
    expect(serverCode).toContain('[DONE]')
    expect(serverCode).toContain('\\n\\n')
  })

  it('sets proper SSE headers', () => {
    expect(serverCode).toContain("res.setHeader('Content-Type', 'text/event-stream')")
    expect(serverCode).toContain("res.setHeader('Cache-Control', 'no-cache')")
    expect(serverCode).toContain("res.setHeader('Connection', 'keep-alive')")
  })

  it('passes system prompt to messages.stream', () => {
    expect(serverCode).toContain('system: SYSTEM_PROMPT')
  })

  it('uses async generator for streaming', () => {
    expect(serverCode).toContain('for await')
    expect(serverCode).toContain('const stream = client.messages.stream')
  })

  it('handles errors gracefully', () => {
    expect(serverCode).toContain('catch (err)')
    expect(serverCode).toContain('console.error')
  })

  it('returns error in SSE if Anthropic call fails', () => {
    expect(serverCode).toContain("{ error: err.message }")
  })

  it('runs on port 3001', () => {
    expect(serverCode).toContain('PORT = 3001')
  })
})
