import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function EditArticle({ onNavClick, showToast, articleId }) {
  const { token, isAuthor, isAdmin } = useAuth()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('technology')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')

  const categories = ['technology', 'politics', 'sports', 'entertainment', 'world', 'science', 'health', 'business']

  useEffect(() => {
    if (!articleId) { onNavClick('/my-articles'); return }
    fetchArticle()
  }, [articleId])

  const fetchArticle = async () => {
    setFetching(true)
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setTitle(data.title || '')
      setExcerpt(data.excerpt || '')
      setCategory(data.category || 'technology')
      setImage(data.image || '')
      setContent(data.content || '')
    } catch (err) {
      setError(err.message)
    }
    setFetching(false)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, excerpt, category, image, content })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      if (showToast) showToast('Article updated successfully!')
      onNavClick('/my-articles')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
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
            <i className="fas fa-edit" /> Edit Article
          </h1>
          <p className="write-subtitle">Update your article</p>
        </div>

        {error && <div className="auth-error"><i className="fas fa-exclamation-circle" /> {error}</div>}

        {fetching ? (
          <div className="admin-loading"><div className="admin-spinner" /></div>
        ) : (
          <form className="write-form" onSubmit={handleUpdate}>
            <div className="write-field">
              <label className="write-label">Title</label>
              <input
                type="text"
                className="write-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="write-field">
              <label className="write-label">Excerpt</label>
              <input
                type="text"
                className="write-input"
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
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
            </div>

            <div className="write-field">
              <label className="write-label">Content</label>
              <textarea
                className="write-textarea"
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
                onClick={() => onNavClick('/my-articles')}
              >
                <i className="fas fa-arrow-left" /> Cancel
              </button>
              <button type="submit" className="write-btn submit" disabled={loading}>
                {loading ? 'Updating...' : <><i className="fas fa-save" /> Save Changes</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
