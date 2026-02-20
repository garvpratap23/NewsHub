import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function BookmarksPage({ openArticle, onNavClick }) {
  const { token, isAuthenticated } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    fetchBookmarks()
  }, [isAuthenticated])

  const fetchBookmarks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/bookmarks', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setBookmarks(Array.isArray(data) ? data : [])
      } else {
        setBookmarks([])
      }
    } catch (err) {
      console.error(err)
      setBookmarks([])
    }
    setLoading(false)
  }

  const handleRemoveBookmark = async (articleId) => {
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId })
    })
    fetchBookmarks()
  }

  const handleArticleClick = (article) => {
    // For database articles, navigate to view page
    if (article._id && onNavClick) {
      onNavClick(`/view/${article._id}`)
    } else if (openArticle) {
      openArticle(article)
    }
  }

  return (
    <section className="bookmarks-page">
      <div className="bookmarks-bg">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-gradient"></div>
      </div>
      <div className="bookmarks-container">
        <div className="bookmarks-header">
          <h1 className="bookmarks-title">
            <i className="fas fa-bookmark" /> Bookmarks
          </h1>
          <p className="bookmarks-subtitle">Your saved articles for later reading</p>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /></div>
        ) : !isAuthenticated ? (
          <div className="empty-state">
            <i className="fas fa-sign-in-alt" />
            <h3>Please log in</h3>
            <p>You need to be logged in to view your bookmarks</p>
            <button className="btn btn-primary" onClick={() => onNavClick && onNavClick('/login')}>
              Log In
            </button>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-bookmark" />
            <h3>No bookmarks yet</h3>
            <p>Save articles to read later!</p>
          </div>
        ) : (
          <div className="bookmarks-grid">
            {bookmarks.map(article => (
              <div key={article._id} className="bookmark-card" onClick={() => handleArticleClick(article)}>
                <div className="bookmark-card-image">
                  <img src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=400'} alt={article.title} />
                </div>
                <div className="bookmark-card-body">
                  <span className="category-badge">{article.category}</span>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="bookmark-card-meta">
                    <span>{article.date}</span>
                    <button
                      className="remove-bookmark-btn"
                      onClick={(e) => { e.stopPropagation(); handleRemoveBookmark(article._id) }}
                    >
                      <i className="fas fa-trash" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
