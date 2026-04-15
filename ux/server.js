import express from 'express'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
app.use(express.json({ limit: '10mb' }))

const client = new Anthropic()

const SYSTEM_PROMPT = `You are an expert golf rules official with deep knowledge of the Rules of Golf (2023 edition) as published by the R&A and USGA. You help golfers on the course understand and apply the rules correctly.

When given a situation — described in text or shown in a photo — you:
1. Identify the applicable rule(s) by number and title
2. Explain the golfer's options clearly and concisely
3. State any penalty strokes involved
4. Offer a practical tip to avoid or handle the situation

Keep responses concise and practical. Use plain language. If an image is provided, describe what you see and how it affects the ruling. Always cite the specific Rule number.`

app.post('/api/rules', async (req, res) => {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    })

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error('Anthropic error:', err)
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

const PORT = 3001
app.listen(PORT, () => console.log(`Rules API server running on port ${PORT}`))
