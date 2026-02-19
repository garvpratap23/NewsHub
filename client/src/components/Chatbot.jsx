import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
]

export default function Chatbot({ articleContext }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your NewsHub assistant. Ask me anything about the article you\'re reading or any news-related questions!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('en')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (articleContext?.title && messages.length === 1) {
      setMessages([{
        role: 'assistant',
        content: `Hi! I see you're reading "${articleContext.title}". Feel free to ask me anything about this article - I can verify facts, explain concepts, or answer any questions!`
      }])
    }
  }, [articleContext?.title])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: articleContext,
          language
        })
      })

      const data = await res.json()
      if (res.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t process that. Please try again.' }])
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.' }])
    }

    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: articleContext?.title
        ? `Chat cleared! I'm still here to help with "${articleContext.title}".`
        : 'Chat cleared! How can I help you?'
    }])
  }

  const currentLang = languages.find(l => l.code === language)

  return (
    <>
      <button
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <i className="fas fa-times" />
        ) : (
          <i className="fas fa-comment-dots" />
        )}
      </button>

      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <i className="fas fa-robot" />
            </div>
            <div className="chatbot-header-text">
              <h4>NewsHub Assistant</h4>
              <span className="chatbot-status">
                <span className="status-dot" /> Online
              </span>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <div className="lang-selector">
              <button
                className="lang-btn"
                onClick={() => setShowLangMenu(!showLangMenu)}
              >
                {currentLang?.flag} <i className="fas fa-chevron-down" />
              </button>
              {showLangMenu && (
                <div className="lang-menu">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      className={`lang-option ${language === lang.code ? 'active' : ''}`}
                      onClick={() => { setLanguage(lang.code); setShowLangMenu(false) }}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="chatbot-action-btn" onClick={clearChat} title="Clear chat">
              <i className="fas fa-trash-alt" />
            </button>
            <button className="chatbot-action-btn" onClick={() => setIsOpen(false)} title="Close">
              <i className="fas fa-minus" />
            </button>
          </div>
        </div>

        {articleContext?.title && (
          <div className="chatbot-context-bar">
            <i className="fas fa-newspaper" />
            <span>Reading: {articleContext.title.substring(0, 40)}...</span>
          </div>
        )}

        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="chat-message-avatar">
                  <i className="fas fa-robot" />
                </div>
              )}
              <div className="chat-message-content">
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-message assistant">
              <div className="chat-message-avatar">
                <i className="fas fa-robot" />
              </div>
              <div className="chat-message-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input-area">
          <div className="chatbot-suggestions">
            {articleContext?.title && (
              <>
                <button onClick={() => { setInput('Is this article accurate?'); setTimeout(sendMessage, 100) }}>
                  Verify facts
                </button>
                <button onClick={() => { setInput('Summarize this article'); setTimeout(sendMessage, 100) }}>
                  Summarize
                </button>
                <button onClick={() => { setInput('What are the sources?'); setTimeout(sendMessage, 100) }}>
                  Sources
                </button>
              </>
            )}
          </div>
          <div className="chatbot-input-row">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="chatbot-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              <i className="fas fa-paper-plane" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
