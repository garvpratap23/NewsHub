import { useState, useEffect, useRef, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import CommentsSection from './CommentsSection'

export default function ArticleModal({ data, onClose, showToast }) {
  const { token, user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])

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

  // Cleanup on unmount or when data changes
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
      if (ttsIntervalRef.current) clearInterval(ttsIntervalRef.current)
    }
  }, [data?._id, data?.id])

  if (!data) return null

  const handleLike = async () => {
    if (!token) { if (showToast) showToast('Login to like articles'); return }
    if (!data._id) { setLiked(!liked); setLikesCount(p => liked ? p - 1 : p + 1); return }
    try {
      const res = await fetch(`/api/engage/${data._id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const d = await res.json()
      setLiked(d.liked)
      setLikesCount(d.likesCount)
    } catch (err) {
      setLiked(!liked)
      setLikesCount(p => liked ? p - 1 : p + 1)
    }
  }

  const handleBookmark = async () => {
    if (!token) { if (showToast) showToast('Login to bookmark articles'); return }
    if (!data._id) { setBookmarked(!bookmarked); if (showToast) showToast(bookmarked ? 'Removed bookmark' : 'Bookmarked!'); return }
    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: data._id })
      })
      setBookmarked(!bookmarked)
      if (showToast) showToast(bookmarked ? 'Removed bookmark' : 'Bookmarked!')
    } catch (err) { }
  }

  const handleShare = async () => {
    const url = window.location.origin + (data._id ? `/view/${data._id}` : '/')
    const text = data.title || 'Check out this article'
    if (navigator.share) {
      try { await navigator.share({ title: text, url }) } catch (e) { }
    } else {
      navigator.clipboard.writeText(url)
      if (showToast) showToast('Link copied to clipboard!')
    }
  }

  // --- TTS Player Logic ---
  const getTTSText = useCallback(() => {
    if (!data) return ''
    return `${data.title}. ${data.content || data.excerpt}`
  }, [data])

  const estimateDuration = (text, rate) => {
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
      window.speechSynthesis.pause()
      setPaused(true)
      clearInterval(ttsIntervalRef.current)
      const elapsed = (Date.now() - ttsStartTimeRef.current) / 1000
      ttsPausedAtRef.current = elapsed
      return
    }

    if (speaking && paused) {
      window.speechSynthesis.resume()
      setPaused(false)
      startProgressTracker(ttsDurationRef.current, ttsPausedAtRef.current)
      return
    }

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

  const totalDuration = data ? estimateDuration(getTTSText(), ttsSpeed) : 0
  const currentTime = (ttsProgress / 100) * totalDuration
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2]

  return (
    <div
      className={`article-modal${data ? ' active' : ''}`}
      style={data ? { opacity: 1, visibility: 'visible', pointerEvents: 'auto' } : {}}
    >
      <button className="article-modal-close" onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false); onClose() }}>&times;</button>
      <div className="article-modal-content">
        <img
          src={data.image}
          alt=""
          className="article-header-image"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800';
            e.target.onerror = null;
          }}
        />
        <span className="article-category">{data.categoryLabel || data.category}</span>
        <h1 className="article-title">{data.title}</h1>
        <div className="article-meta">
          <div className="article-meta-item">
            <i className="far fa-user"></i>
            <span>{data.author}</span>
          </div>
          <div className="article-meta-item">
            <i className="far fa-clock"></i>
            <span>{data.date}</span>
          </div>
          <div className="article-meta-item">
            <i className="far fa-eye"></i>
            <span>{data.views} views</span>
          </div>
        </div>
        <div className="article-body">
          {data.content ? (
            data.content.split('\n').map((para, i) => (
              para.trim() ? <p key={i}>{para}</p> : null
            ))
          ) : (
            <>
              <p>{data.excerpt}</p>
              <p>This is a live news article fetched in real-time. Full article content is available from the original source.</p>
            </>
          )}
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
            articleId={data._id}
            comments={comments}
            setComments={setComments}
            showToast={showToast}
          />
        )}
      </div>
    </div>
  )
}
