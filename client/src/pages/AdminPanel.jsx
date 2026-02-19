import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminPanel({ onNavClick }) {
  const { token, isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [articles, setArticles] = useState([])
  const [pendingArticles, setPendingArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewNote, setReviewNote] = useState('')
  const [expandedArticle, setExpandedArticle] = useState(null)

  useEffect(() => {
    if (!isAdmin) { onNavClick('/'); return }
    fetchData()
  }, [isAdmin])

  const fetchData = async () => {
    setLoading(true)
    try {
      const headers = { 'Authorization': `Bearer ${token}` }
      const [statsRes, usersRes, articlesRes, pendingRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/articles', { headers }),
        fetch('/api/admin/articles?status=pending', { headers })
      ])
      setStats(await statsRes.json())
      setUsers(await usersRes.json())
      setArticles(await articlesRes.json())
      setPendingArticles(await pendingRes.json())
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchData()
  }

  const handleRoleChange = async (id, newRole) => {
    await fetch(`/api/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    })
    fetchData()
  }

  const handleReview = async (id, status) => {
    await fetch(`/api/articles/${id}/review`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reviewNote })
    })
    setReviewNote('')
    fetchData()
  }

  const handlePublish = async (id) => {
    await fetch(`/api/articles/${id}/publish`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchData()
  }

  const handleDeleteArticle = async (id) => {
    if (!confirm('Delete this article?')) return
    await fetch(`/api/articles/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchData()
  }

  if (loading) return (
    <section className="admin-page">
      <div className="admin-loading"><div className="admin-spinner" /></div>
    </section>
  )

  return (
    <section className="admin-page">
      <div className="admin-bg">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-gradient"></div>
      </div>
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">
            <i className="fas fa-shield-alt" /> Admin Panel
          </h1>
          <p className="admin-subtitle">Manage users, articles, and review submissions</p>
        </div>

        <div className="admin-tabs">
          {['dashboard', 'users', 'articles', 'review'].map(tab => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <i className={`fas fa-${tab === 'dashboard' ? 'chart-bar' : tab === 'users' ? 'users' : tab === 'articles' ? 'newspaper' : 'tasks'}`} />
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'review' && pendingArticles.length > 0 && (
                <span className="admin-badge">{pendingArticles.length}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && stats && (
          <div className="admin-dashboard">
            <div className="stats-grid">
              <div className="stat-card clickable" onClick={() => setActiveTab('users')}>
                <div className="stat-icon"><i className="fas fa-users" /></div>
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
              <div className="stat-card clickable" onClick={() => setActiveTab('users')}>
                <div className="stat-icon authors"><i className="fas fa-pen-nib" /></div>
                <div className="stat-value">{stats.totalAuthors}</div>
                <div className="stat-label">Authors</div>
              </div>
              <div className="stat-card clickable" onClick={() => setActiveTab('articles')}>
                <div className="stat-icon articles"><i className="fas fa-newspaper" /></div>
                <div className="stat-value">{stats.totalArticles}</div>
                <div className="stat-label">Total Articles</div>
              </div>
              <div className="stat-card clickable" onClick={() => setActiveTab('review')}>
                <div className="stat-icon pending"><i className="fas fa-clock" /></div>
                <div className="stat-value">{stats.pendingArticles}</div>
                <div className="stat-label">Pending Review</div>
              </div>
              <div className="stat-card clickable" onClick={() => setActiveTab('articles')}>
                <div className="stat-icon published"><i className="fas fa-check-circle" /></div>
                <div className="stat-value">{stats.publishedArticles}</div>
                <div className="stat-label">Published</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(255, 107, 107, 0.12)', color: '#ff6b6b' }}><i className="fas fa-heart" /></div>
                <div className="stat-value">{stats.totalLikes || 0}</div>
                <div className="stat-label">Total Likes</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(108, 92, 231, 0.12)', color: '#6c5ce7' }}><i className="fas fa-comments" /></div>
                <div className="stat-value">{stats.totalComments || 0}</div>
                <div className="stat-label">Total Comments</div>
              </div>
              <div className="stat-card clickable" onClick={() => setActiveTab('users')}>
                <div className="stat-icon readers"><i className="fas fa-book-reader" /></div>
                <div className="stat-value">{stats.totalReaders}</div>
                <div className="stat-label">Readers</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td><div className="user-cell"><div className="table-avatar">{u.name?.charAt(0)}</div>{u.name}</div></td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="role-select"
                      >
                        <option value="reader">Reader</option>
                        <option value="author">Author</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u.role !== 'admin' && (
                        <button className="action-btn delete" onClick={() => handleDeleteUser(u._id)}>
                          <i className="fas fa-trash" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a._id}>
                    <td className="title-cell">{a.title}</td>
                    <td>{a.author}</td>
                    <td><span className="category-badge">{a.category}</span></td>
                    <td><span className={`status-badge ${a.status || 'published'}`}>{a.status || 'published'}</span></td>
                    <td className="actions-cell">
                      <button className="action-btn publish" onClick={() => onNavClick(`/view/${a._id}`)} title="View">
                        <i className="fas fa-eye" />
                      </button>
                      {a.status === 'approved' && (
                        <button className="action-btn publish" onClick={() => handlePublish(a._id)} title="Publish">
                          <i className="fas fa-paper-plane" />
                        </button>
                      )}
                      <button className="action-btn delete" onClick={() => handleDeleteArticle(a._id)} title="Delete">
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'review' && (
          <div className="review-queue">
            {pendingArticles.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-check-double" />
                <h3>All caught up!</h3>
                <p>No articles pending review</p>
              </div>
            ) : (
              pendingArticles.map(a => (
                <div key={a._id} className="review-card">
                  <div className="review-card-header">
                    <h3>{a.title}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="category-badge">{a.category}</span>
                      <button
                        className="action-btn publish"
                        onClick={() => setExpandedArticle(expandedArticle === a._id ? null : a._id)}
                        title="View full article"
                      >
                        <i className={`fas fa-${expandedArticle === a._id ? 'chevron-up' : 'eye'}`} />
                      </button>
                    </div>
                  </div>
                  <p className="review-excerpt">{a.excerpt}</p>
                  {expandedArticle === a._id && (
                    <div className="review-full-content">
                      {a.image && <img src={a.image} alt={a.title} style={{ width: '100%', borderRadius: '12px', marginBottom: '16px', maxHeight: '300px', objectFit: 'cover' }} />}
                      <div className="view-article-content">
                        {(a.content || '').split('\n').map((para, i) => (
                          para.trim() ? <p key={i}>{para}</p> : null
                        ))}
                      </div>
                    </div>
                  )}
                  {expandedArticle !== a._id && (
                    <div className="review-content">{a.content?.substring(0, 300)}...</div>
                  )}
                  <div className="review-meta">
                    <span><i className="fas fa-user" /> {a.author}</span>
                    <span><i className="fas fa-calendar" /> {a.date}</span>
                  </div>
                  <div className="review-actions">
                    <input
                      type="text"
                      placeholder="Review note (optional)"
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      className="review-note-input"
                    />
                    <button className="review-btn approve" onClick={() => handleReview(a._id, 'published')}>
                      <i className="fas fa-check" /> Approve & Publish
                    </button>
                    <button className="review-btn reject" onClick={() => handleReview(a._id, 'rejected')}>
                      <i className="fas fa-times" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
