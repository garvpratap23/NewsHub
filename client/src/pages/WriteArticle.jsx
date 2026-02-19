import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function WriteArticle({ onNavClick, showToast }) {
  const { token, isAuthor, isAdmin } = useAuth()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('technology')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // AI states
  const [aiTitles, setAiTitles] = useState([])
  const [aiTitleLoading, setAiTitleLoading] = useState(false)
  const [aiExcerptLoading, setAiExcerptLoading] = useState(false)
  const [aiContentLoading, setAiContentLoading] = useState(false)
  const [showToneSelector, setShowToneSelector] = useState(false)

  const categories = ['technology', 'politics', 'sports', 'entertainment', 'world', 'science', 'health', 'business']

  const tones = [
    { id: 'professional', label: 'Professional', icon: 'fas fa-briefcase', desc: 'Formal & authoritative' },
    { id: 'casual', label: 'Casual', icon: 'fas fa-coffee', desc: 'Conversational & easy' },
    { id: 'sarcastic', label: 'Sarcastic', icon: 'fas fa-theater-masks', desc: 'Witty & ironic' },
    { id: 'funny', label: 'Funny', icon: 'fas fa-laugh-beam', desc: 'Humorous & lighthearted' },
    { id: 'academic', label: 'Academic', icon: 'fas fa-graduation-cap', desc: 'Scholarly & detailed' },
    { id: 'dramatic', label: 'Dramatic', icon: 'fas fa-fire', desc: 'Intense & vivid' }
  ]

  const handleSubmit = async (e, status = 'pending') => {
    e.preventDefault()
    if (!isAuthor && !isAdmin) { onNavClick('/'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, excerpt, category, image, content, status })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      if (showToast) showToast(status === 'draft' ? 'Article saved as draft!' : 'Article submitted for review!')
      onNavClick('/my-articles')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  // AI: Generate Title
  const handleGenerateTitle = async () => {
    if (!title.trim()) { setError('Please enter a draft title first'); return }
    setAiTitleLoading(true)
    setAiTitles([])
    setError('')
    try {
      const res = await fetch('/api/ai/generate-title', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setAiTitles(data.titles || [])
    } catch (err) {
      setError('AI title generation failed: ' + err.message)
    }
    setAiTitleLoading(false)
  }

  // AI: Generate Excerpt
  const handleGenerateExcerpt = async () => {
    if (!content.trim()) { setError('Please write some content first to generate an excerpt'); return }
    setAiExcerptLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/generate-excerpt', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setExcerpt(data.excerpt)
      if (showToast) showToast('Excerpt generated!')
    } catch (err) {
      setError('AI excerpt generation failed: ' + err.message)
    }
    setAiExcerptLoading(false)
  }

  // AI: Enhance Content
  const handleEnhanceContent = async (tone) => {
    if (!content.trim()) { setError('Please write some content first'); return }
    setShowToneSelector(false)
    setAiContentLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ai/enhance-content', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, tone })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setContent(data.content)
      if (showToast) showToast(`Content enhanced with ${tone} tone!`)
    } catch (err) {
      setError('AI content enhancement failed: ' + err.message)
    }
    setAiContentLoading(false)
  }

  if (!isAuthor && !isAdmin) return null

  return (
    <section className="write-page">
      <div className="write-bg">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-gradient"></div>
      </div>
      <div className="write-container">
        <div className="write-header">
          <h1 className="write-title">
            <i className="fas fa-pen-fancy" /> Write Article
          </h1>
          <p className="write-subtitle">Create and submit your article for review — powered by AI</p>
        </div>

        {error && <div className="auth-error"><i className="fas fa-exclamation-circle" /> {error}</div>}

        <form className="write-form" onSubmit={(e) => handleSubmit(e, 'pending')}>
          <div className="write-field">
            <div className="write-label-row">
              <label className="write-label">Title</label>
              <button
                type="button"
                className="ai-tool-btn"
                onClick={handleGenerateTitle}
                disabled={aiTitleLoading}
              >
                {aiTitleLoading ? (
                  <><i className="fas fa-spinner fa-spin" /> Generating...</>
                ) : (
                  <><i className="fas fa-magic" /> AI Generate Title</>
                )}
              </button>
            </div>
            <input
              type="text"
              className="write-input"
              placeholder="Enter a draft title — AI can improve it"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {aiTitles.length > 0 && (
              <div className="ai-suggestions">
                <span className="ai-suggestions-label"><i className="fas fa-robot" /> AI Suggestions — click to use:</span>
                {aiTitles.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    className="ai-suggestion-chip"
                    onClick={() => { setTitle(t); setAiTitles([]) }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="write-field">
            <div className="write-label-row">
              <label className="write-label">Excerpt</label>
              <button
                type="button"
                className="ai-tool-btn"
                onClick={handleGenerateExcerpt}
                disabled={aiExcerptLoading}
              >
                {aiExcerptLoading ? (
                  <><i className="fas fa-spinner fa-spin" /> Generating...</>
                ) : (
                  <><i className="fas fa-wand-magic-sparkles" /> AI Generate Excerpt</>
                )}
              </button>
            </div>
            <input
              type="text"
              className="write-input"
              placeholder="A brief summary — or let AI generate it from your content"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
            />
          </div>

          <div className="write-row">
            <div className="write-field">
              <label className="write-label">Category</label>
              <select className="write-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="write-field">
              <label className="write-label">Image URL</label>
              <input
                type="url"
                className="write-input"
                placeholder="https://example.com/image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>

          <div className="write-field">
            <div className="write-label-row">
              <label className="write-label">Content</label>
              <div className="ai-enhance-wrapper">
                <button
                  type="button"
                  className="ai-tool-btn enhance"
                  onClick={() => setShowToneSelector(!showToneSelector)}
                  disabled={aiContentLoading}
                >
                  {aiContentLoading ? (
                    <><i className="fas fa-spinner fa-spin" /> Enhancing...</>
                  ) : (
                    <><i className="fas fa-wand-magic-sparkles" /> AI Enhance Content</>
                  )}
                </button>
                {showToneSelector && (
                  <div className="tone-selector">
                    <div className="tone-selector-header">
                      <i className="fas fa-palette" /> Choose article tone:
                    </div>
                    <div className="tone-options">
                      {tones.map(tone => (
                        <button
                          key={tone.id}
                          type="button"
                          className="tone-option"
                          onClick={() => handleEnhanceContent(tone.id)}
                        >
                          <i className={tone.icon} />
                          <div>
                            <span className="tone-name">{tone.label}</span>
                            <small className="tone-desc">{tone.desc}</small>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <textarea
              className="write-textarea"
              placeholder="Write your article content here... then use AI to enhance it!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              required
            />
          </div>

          <div className="write-actions">
            <button
              type="button"
              className="write-btn draft"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading}
            >
              <i className="fas fa-save" /> Save Draft
            </button>
            <button type="submit" className="write-btn submit" disabled={loading}>
              {loading ? 'Submitting...' : <><i className="fas fa-paper-plane" /> Submit for Review</>}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
