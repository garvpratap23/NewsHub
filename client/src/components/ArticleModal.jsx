import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import CommentsSection from './CommentsSection'

export default function ArticleModal({ data, onClose, showToast }) {
  const { token, user } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState([])
  const [speaking, setSpeaking] = useState(false)

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

  const handleComment = async () => {
    if (!token) { if (showToast) showToast('Login to comment'); return }
    if (!commentText.trim()) return
    if (!data._id) {
      setComments(prev => [...prev, { userName: user?.name || 'You', text: commentText, createdAt: new Date() }])
      setCommentText('')
      if (showToast) showToast('Comment added!')
      return
    }
    try {
      const res = await fetch(`/api/engage/${data._id}/comment`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText })
      })
      const d = await res.json()
      setComments(d.comments || [])
      setCommentText('')
      if (showToast) showToast('Comment added!')
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

  const toggleTTS = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(
        `${data.title}. ${data.content || data.excerpt}`
      )
      utterance.rate = 0.95
      utterance.onend = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
      setSpeaking(true)
    }
  }

  return (
    <div className={`article-modal${data ? ' active' : ''}`}>
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
          <button className={`engage-btn ${speaking ? 'active' : ''}`} onClick={toggleTTS}>
            <i className={speaking ? 'fas fa-stop' : 'fas fa-volume-up'} />
            <span>{speaking ? 'Stop' : 'Listen'}</span>
          </button>
        </div>

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
