import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import CommentsSection from '../components/CommentsSection'

export default function ViewArticle({ onNavClick, articleId, setCurrentViewArticle }) {
  const { token, user } = useAuth()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  // TTS states
  const [ttsOpen, setTtsOpen] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [ttsProgress, setTtsProgress] = useState(0)
  const [ttsSpeed, setTtsSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const ttsTextRef = useRef('')
  const ttsIntervalRef = useRef(null)
  const ttsStartTimeRef = useRef(0)
  const ttsDurationRef = useRef(0)
  const ttsPausedAtRef = useRef(0)
  const utteranceRef = useRef(null)
  const isDraggingRef = useRef(false)

  // Engagement states
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])

  useEffect(() => {
    if (!articleId) { onNavClick('/my-articles'); return }
    fetchArticle()
    fetchEngagement()
    return () => {
      window.speechSynthesis.cancel()
      clearInterval(ttsIntervalRef.current)
      if (setCurrentViewArticle) setCurrentViewArticle(null)
    }
  }, [articleId])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setArticle(data)
        if (setCurrentViewArticle) setCurrentViewArticle(data)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const fetchEngagement = async () => {
    try {
      const res = await fetch(`/api/engage/${articleId}`)
      const data = await res.json()
      setLikesCount(data.likesCount || 0)
      setComments(data.comments || [])
      if (user && data.likes?.includes(user._id)) setLiked(true)
    } catch (err) { }
  }

  const handleLike = async () => {
    if (!token) return
    try {
      const res = await fetch(`/api/engage/${articleId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const d = await res.json()
      setLiked(d.liked)
      setLikesCount(d.likesCount)
    } catch (err) { }
  }

  const handleBookmark = async () => {
    if (!token) return
    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId })
      })
      setBookmarked(!bookmarked)
    } catch (err) { }
  }

  const handleShare = async () => {
    const url = window.location.origin + `/view/${articleId}`
    if (navigator.share) {
      try { await navigator.share({ title: article?.title, url }) } catch (e) { }
    } else {
      navigator.clipboard.writeText(url)
    }
  }

  // --- TTS Player Logic ---
  const getTTSText = useCallback(() => {
    if (!article) return ''
    return `${article.title}. ${article.content || article.excerpt}`
  }, [article])

  const estimateDuration = (text, rate) => {
    // Average speaking rate: ~150 words per minute at 1x
    const words = text.split(/\s+/).length
    return (words / (150 * rate)) * 60 // seconds
  }

  const startProgressTracker = (duration, startFrom = 0) => {
    clearInterval(ttsIntervalRef.current)
    ttsStartTimeRef.current = Date.now() - (startFrom * 1000)
    ttsDurationRef.current = duration

    ttsIntervalRef.current = setInterval(() => {
      if (isDraggingRef.current) return
      const elapsed = (Date.now() - ttsStartTimeRef.current) / 1000
      const pct = Math.min((elapsed / duration) * 100, 100)
      setTtsProgress(pct)
      if (pct >= 100) clearInterval(ttsIntervalRef.current)
    }, 100)
  }

  const handleTTSPlay = () => {
    if (speaking && !paused) {
      // Pause
      window.speechSynthesis.pause()
      setPaused(true)
      clearInterval(ttsIntervalRef.current)
      const elapsed = (Date.now() - ttsStartTimeRef.current) / 1000
      ttsPausedAtRef.current = elapsed
      return
    }

    if (speaking && paused) {
      // Resume
      window.speechSynthesis.resume()
      setPaused(false)
      const remaining = ttsDurationRef.current - ttsPausedAtRef.current
      startProgressTracker(ttsDurationRef.current, ttsPausedAtRef.current)
      return
    }

    // Start fresh
    const text = getTTSText()
    if (!text) return
    ttsTextRef.current = text
    speakFromPosition(0, ttsSpeed)
  }

  const speakFromPosition = (progressPct, rate) => {
    window.speechSynthesis.cancel()
    clearInterval(ttsIntervalRef.current)

    const text = ttsTextRef.current || getTTSText()
    if (!text) return

    // Calculate the character position to start from
    const startChar = Math.floor((progressPct / 100) * text.length)
    const textToSpeak = text.substring(startChar)

    if (!textToSpeak.trim()) {
      setSpeaking(false)
      setPaused(false)
      setTtsProgress(100)
      return
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.rate = rate
    utteranceRef.current = utterance

    const totalDuration = estimateDuration(text, rate)
    const startSeconds = (progressPct / 100) * totalDuration

    utterance.onstart = () => {
      setSpeaking(true)
      setPaused(false)
      setTtsOpen(true)
      startProgressTracker(totalDuration, startSeconds)
    }

    utterance.onend = () => {
      setSpeaking(false)
      setPaused(false)
      setTtsProgress(100)
      clearInterval(ttsIntervalRef.current)
    }

    utterance.onerror = () => {
      setSpeaking(false)
      setPaused(false)
      clearInterval(ttsIntervalRef.current)
    }

    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }

  const handleTTSStop = () => {
    window.speechSynthesis.cancel()
    clearInterval(ttsIntervalRef.current)
    setSpeaking(false)
    setPaused(false)
    setTtsProgress(0)
    setTtsOpen(false)
  }

  const handleSliderDragStart = () => {
    isDraggingRef.current = true
  }

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value)
    setTtsProgress(val)
  }

  const handleSliderCommit = (e) => {
    isDraggingRef.current = false
    const val = parseFloat(e.target.value)
    if (speaking || paused) {
      speakFromPosition(val, ttsSpeed)
    } else {
      setTtsProgress(val)
    }
  }

  const handleSpeedChange = (speed) => {
    setTtsSpeed(speed)
    setShowSpeedMenu(false)
    if (speaking || paused) {
      // Restart from current position with new speed
      speakFromPosition(ttsProgress, speed)
    }
  }

  const toggleTTSPanel = () => {
    if (ttsOpen) {
      handleTTSStop()
    } else {
      ttsTextRef.current = getTTSText()
      setTtsOpen(true)
    }
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return 'fas fa-file-alt'
      case 'pending': return 'fas fa-clock'
      case 'approved': return 'fas fa-check'
      case 'published': return 'fas fa-globe'
      case 'rejected': return 'fas fa-times-circle'
      default: return 'fas fa-file'
    }
  }

  const totalDuration = article ? estimateDuration(getTTSText(), ttsSpeed) : 0
  const currentTime = (ttsProgress / 100) * totalDuration
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]

  return (
    <section className="write-page">
      <div className="write-bg">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-gradient"></div>
      </div>
      <div className="write-container" style={{ maxWidth: '900px' }}>
        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /></div>
        ) : !article ? (
          <div className="empty-state">
            <i className="fas fa-exclamation-triangle" />
            <h3>Article not found</h3>
            <button className="write-new-btn" onClick={() => onNavClick('/my-articles')}>
              <i className="fas fa-arrow-left" /> Back to My Articles
            </button>
          </div>
        ) : (
          <div className="view-article">
            <div className="view-article-header">
              <button className="view-back-btn" onClick={() => onNavClick('/my-articles')}>
                <i className="fas fa-arrow-left" /> Back
              </button>
              <div className="view-article-actions">
                <button className="ai-tool-btn enhance" onClick={() => onNavClick(`/edit/${articleId}`)}>
                  <i className="fas fa-edit" /> Edit
                </button>
              </div>
            </div>

            {article.image && (
              <div className="view-article-image">
                <img
                  src={article.image}
                  alt=""
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800';
                    e.target.onerror = null;
                  }}
                />
              </div>
            )}

            <div className="view-article-meta">
              <span className="category-badge">{article.category}</span>
              <span className={`status-badge ${article.status || 'published'}`}>
                <i className={getStatusIcon(article.status || 'published')} />
                {(article.status || 'published').charAt(0).toUpperCase() + (article.status || 'published').slice(1)}
              </span>
              <span className="article-date"><i className="fas fa-calendar" /> {article.date}</span>
              <span className="article-date"><i className="fas fa-eye" /> {article.views || '0'} views</span>
            </div>

            <h1 className="view-article-title">{article.title}</h1>

            {article.excerpt && (
              <p className="view-article-excerpt">{article.excerpt}</p>
            )}

            {article.reviewNote && (
              <div className="review-note-display">
                <i className="fas fa-comment" /> Admin Review: {article.reviewNote}
              </div>
            )}

            <div className="view-article-content">
              {(article.content || '').split('\n').map((para, i) => (
                para.trim() ? <p key={i}>{para}</p> : null
              ))}
            </div>

            <div className="engagement-bar">
              <button className={`engage-btn ${liked ? 'active' : ''}`} onClick={handleLike}>
                <i className={liked ? 'fas fa-heart' : 'far fa-heart'} />
                <span>{likesCount > 0 ? likesCount : 'Like'}</span>
              </button>
              <button className={`engage-btn ${showComments ? 'active' : ''}`} onClick={() => setShowComments(!showComments)}>
                <i className="far fa-comment" />
                <span>{comments.length > 0 ? comments.length : 'Comment'}</span>
              </button>
              <button className={`engage-btn ${bookmarked ? 'active' : ''}`} onClick={handleBookmark}>
                <i className={bookmarked ? 'fas fa-bookmark' : 'far fa-bookmark'} />
                <span>{bookmarked ? 'Saved' : 'Save'}</span>
              </button>
              <button className="engage-btn" onClick={handleShare}>
                <i className="fas fa-share-alt" />
                <span>Share</span>
              </button>
              <button className={`engage-btn ${ttsOpen ? 'active' : ''}`} onClick={toggleTTSPanel}>
                <i className={ttsOpen ? 'fas fa-stop' : 'fas fa-volume-up'} />
                <span>{ttsOpen ? 'Stop' : 'Listen'}</span>
              </button>
            </div>

            {/* TTS Player */}
            {ttsOpen && (
              <div className="tts-player">
                <div className="tts-player-header">
                  <i className="fas fa-headphones" />
                  <span className="tts-player-title">Audio Player</span>
                </div>

                <div className="tts-controls-row">
                  <button className="tts-play-btn" onClick={handleTTSPlay}>
                    <i className={speaking && !paused ? 'fas fa-pause' : 'fas fa-play'} />
                  </button>

                  <div className="tts-slider-wrapper">
                    <input
                      type="range"
                      className="tts-slider"
                      min="0"
                      max="100"
                      step="0.1"
                      value={ttsProgress}
                      onChange={handleSliderChange}
                      onMouseDown={handleSliderDragStart}
                      onTouchStart={handleSliderDragStart}
                      onMouseUp={handleSliderCommit}
                      onTouchEnd={handleSliderCommit}
                    />
                    <div className="tts-slider-fill" style={{ width: `${ttsProgress}%` }} />
                  </div>

                  <span className="tts-time">
                    {formatTime(currentTime)} / {formatTime(totalDuration)}
                  </span>
                </div>

                <div className="tts-bottom-row">
                  <div className="tts-speed-wrapper">
                    <button className="tts-speed-btn" onClick={() => setShowSpeedMenu(!showSpeedMenu)}>
                      <i className="fas fa-tachometer-alt" /> {ttsSpeed}×
                    </button>
                    {showSpeedMenu && (
                      <div className="tts-speed-menu">
                        {speedOptions.map(s => (
                          <button
                            key={s}
                            className={`tts-speed-option ${ttsSpeed === s ? 'active' : ''}`}
                            onClick={() => handleSpeedChange(s)}
                          >
                            {s}×
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="tts-stop-btn" onClick={handleTTSStop}>
                    <i className="fas fa-stop" /> Stop
                  </button>
                </div>
              </div>
            )}

            {showComments && (
              <CommentsSection
                articleId={articleId}
                comments={comments}
                setComments={setComments}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
