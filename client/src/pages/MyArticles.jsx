import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function MyArticles({ onNavClick, showToast }) {
  const { token, isAuthor, isAdmin } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthor && !isAdmin) { onNavClick('/'); return }
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/articles/mine', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setArticles(await res.json())
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return
    await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (showToast) showToast('Article deleted')
    fetchArticles()
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
    <section className="my-articles-page">
      <div className="my-articles-bg">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-gradient"></div>
      </div>
      <div className="my-articles-container">
        <div className="my-articles-header">
          <div>
            <h1 className="my-articles-title">
              <i className="fas fa-newspaper" /> My Articles
            </h1>
            <p className="my-articles-subtitle">Manage your articles and track their status</p>
          </div>
          <button className="write-new-btn" onClick={() => onNavClick('/write')}>
            <i className="fas fa-plus" /> New Article
          </button>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /></div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-pen-fancy" />
            <h3>No articles yet</h3>
            <p>Start writing your first article!</p>
            <button className="write-new-btn" onClick={() => onNavClick('/write')}>
              <i className="fas fa-plus" /> Write Article
            </button>
          </div>
        ) : (
          <div className="articles-list">
            {articles.map(article => (
              <div key={article._id} className="article-card-row">
                <div className="article-card-image">
                  {article.image && <img src={article.image} alt={article.title} />}
                </div>
                <div className="article-card-info">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-card-meta">
                    <span className="category-badge">{article.category}</span>
                    <span className={`status-badge ${article.status || 'published'}`}>
                      <i className={getStatusIcon(article.status || 'published')} />
                      {(article.status || 'published').charAt(0).toUpperCase() + (article.status || 'published').slice(1)}
                    </span>
                    <span className="article-date"><i className="fas fa-calendar" /> {article.date}</span>
                    <span className="article-date"><i className="fas fa-eye" /> {article.views || '0'}</span>
                  </div>
                  {article.reviewNote && (
                    <div className="review-note-display">
                      <i className="fas fa-comment" /> Review: {article.reviewNote}
                    </div>
                  )}
                </div>
                <div className="article-card-actions">
                  <button
                    className="action-btn publish"
                    onClick={() => onNavClick(`/view/${article._id}`)}
                    title="View"
                  >
                    <i className="fas fa-eye" />
                  </button>
                  <button
                    className="action-btn edit"
                    onClick={() => onNavClick(`/edit/${article._id}`)}
                    title="Edit"
                  >
                    <i className="fas fa-edit" />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(article._id)}
                    title="Delete"
                  >
                    <i className="fas fa-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
