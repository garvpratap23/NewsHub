import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import CommentsSection from '../components/CommentsSection'

export default function ViewArticle({ onNavClick, articleId, setCurrentViewArticle }) {
  const { token, user } = useAuth()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [speaking, setSpeaking] = useState(false)

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

  const toggleTTS = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(
        `${article.title}. ${article.content || article.excerpt}`
      )
      utterance.rate = 0.95
      utterance.onend = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setSpeaking(true)
    }
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
              <button className={`engage-btn ${speaking ? 'active' : ''}`} onClick={toggleTTS}>
                <i className={speaking ? 'fas fa-stop' : 'fas fa-volume-up'} />
                <span>{speaking ? 'Stop' : 'Listen'}</span>
              </button>
            </div>

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
