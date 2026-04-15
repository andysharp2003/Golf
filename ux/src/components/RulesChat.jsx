import { useState, useRef, useEffect } from 'react'

function encodeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve({ base64, mediaType: file.type })
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function buildUserContent(text, image) {
  if (!image) return text
  return [
    {
      type: 'image',
      source: { type: 'base64', media_type: image.mediaType, data: image.base64 },
    },
    { type: 'text', text: text || 'What rule applies here?' },
  ]
}

export default function RulesChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const trimmed = input.trim()
    if (!trimmed && !image) return

    const userContent = buildUserContent(trimmed, image)
    const userMsg = { role: 'user', content: userContent }

    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setImage(null)
    setImagePreview(null)
    setStreaming(true)

    // Add placeholder for assistant turn
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (payload === '[DONE]') break
          try {
            const parsed = JSON.parse(payload)
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.text) {
              setMessages(prev => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                updated[updated.length - 1] = {
                  ...last,
                  content: last.content + parsed.text,
                }
                return updated
              })
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: `Sorry, I couldn't reach the rules server. (${err.message})`,
          error: true,
        }
        return updated
      })
    } finally {
      setStreaming(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const { base64, mediaType } = await encodeImage(file)
    setImage({ base64, mediaType })
    setImagePreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  function removeImage() {
    setImage(null)
    setImagePreview(null)
  }

  function getDisplayText(content) {
    if (typeof content === 'string') return content
    const textPart = content.find(p => p.type === 'text')
    return textPart?.text ?? ''
  }

  function hasImage(content) {
    return Array.isArray(content) && content.some(p => p.type === 'image')
  }

  return (
    <>
      <div className="card-header">
        <span className="card-icon">⚖️</span>
        <h2>Rules Advisor</h2>
      </div>

      <div className="chat-messages" aria-live="polite">
        {messages.length === 0 && (
          <p className="empty-hint">
            Describe your situation or upload a photo of your lie. I'll give you the ruling.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`chat-bubble chat-bubble--${msg.role}${msg.error ? ' chat-bubble--error' : ''}`}
          >
            {msg.role === 'user' && hasImage(msg.content) && (
              <span className="chat-image-tag">📷 Photo attached</span>
            )}
            <span className="chat-text">{getDisplayText(msg.content)}</span>
            {msg.role === 'assistant' && streaming && i === messages.length - 1 && (
              <span className="chat-cursor" aria-hidden="true" />
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {imagePreview && (
        <div className="chat-image-preview">
          <img src={imagePreview} alt="Attached lie photo" />
          <button
            className="chat-image-remove"
            onClick={removeImage}
            aria-label="Remove image"
          >
            ✕
          </button>
        </div>
      )}

      <div className="chat-input-row">
        <button
          className="chat-attach-btn"
          onClick={() => fileInputRef.current.click()}
          aria-label="Attach photo"
          title="Attach a photo of your lie"
          disabled={streaming}
        >
          📷
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFile}
          style={{ display: 'none' }}
          aria-label="Upload lie photo"
        />
        <textarea
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Describe your situation… (Enter to send)"
          rows={2}
          disabled={streaming}
          aria-label="Rules question"
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={streaming || (!input.trim() && !image)}
          aria-label="Send"
        >
          {streaming ? '…' : '▶'}
        </button>
      </div>
    </>
  )
}
