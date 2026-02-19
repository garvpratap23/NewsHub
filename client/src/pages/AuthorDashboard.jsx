import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthorDashboard({ onNavClick }) {
  const { token, user, isAuthor, isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthor && !isAdmin) { onNavClick('/'); return }
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/articles/mine', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setArticles(data)

      // Calculate engagement stats
      const totalViews = data.reduce((sum, a) => {
        const v = parseFloat(a.views) || 0
        return sum + v
      }, 0)

      const statusCounts = { draft: 0, pending: 0, approved: 0, published: 0, rejected: 0 }
      data.forEach(a => { statusCounts[a.status || 'published']++ })

      const categoryCounts = {}
      data.forEach(a => {
        const cat = a.category || 'general'
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1
      })

      const totalLikes = data.reduce((sum, a) => sum + (a.likes?.length || 0), 0)
      const totalComments = data.reduce((sum, a) => sum + (a.comments?.length || 0), 0)

      setStats({
        total: data.length,
        totalViews: totalViews.toFixed(1) + 'K',
        totalLikes,
        totalComments,
        ...statusCounts,
        topCategories: Object.entries(categoryCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
      })
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (!isAuthor && !isAdmin) return null

  return (
    <section className="admin-page">
      <div className="admin-bg">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-gradient"></div>
      </div>
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">
            <i className="fas fa-chart-line" /> Author Dashboard
          </h1>
          <p className="admin-subtitle">Track your articles' performance and engagement</p>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="admin-spinner" /></div>
        ) : (
          <>
            <div className="dashboard-summary-row">
              <div className="stats-column">
                <div className="author-stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon articles"><i className="fas fa-newspaper" /></div>
                    <div className="stat-value">{stats?.total || 0}</div>
                    <div className="stat-label">Articles</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon published"><i className="fas fa-eye" /></div>
                    <div className="stat-value">{stats?.totalViews || '0K'}</div>
                    <div className="stat-label">Views</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(255, 107, 107, 0.12)', color: '#ff6b6b' }}><i className="fas fa-heart" /></div>
                    <div className="stat-value">{stats?.totalLikes || 0}</div>
                    <div className="stat-label">Likes</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(108, 92, 231, 0.12)', color: '#6c5ce7' }}><i className="fas fa-comments" /></div>
                    <div className="stat-value">{stats?.totalComments || 0}</div>
                    <div className="stat-label">Comments</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(0,184,148,0.12)', color: '#00b894' }}><i className="fas fa-globe" /></div>
                    <div className="stat-value">{stats?.published || 0}</div>
                    <div className="stat-label">Published</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon pending"><i className="fas fa-clock" /></div>
                    <div className="stat-value">{stats?.pending || 0}</div>
                    <div className="stat-label">Pending</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(150, 150, 150, 0.12)', color: '#999' }}><i className="fas fa-file-alt" /></div>
                    <div className="stat-value">{stats?.draft || 0}</div>
                    <div className="stat-label">Drafts</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(255, 56, 56, 0.12)', color: '#ff6b6b' }}><i className="fas fa-times-circle" /></div>
                    <div className="stat-value">{stats?.rejected || 0}</div>
                    <div className="stat-label">Rejected</div>
                  </div>
                </div>
              </div>

              <div className="graph-column">
                <div className="compact-graph-card">
                  <div className="graph-header-mini">
                    <h3 className="graph-title-mini">
                      <i className="fas fa-chart-line" /> Engagement
                    </h3>
                  </div>
                  <div className="compact-graph-container">
                    <div className="graph-bars-mini">
                      {[40, 65, 35, 80, 50, 90, 60].map((val, i) => (
                        <div key={i} className="bar-group-mini">
                          <div className="bar-mini like" style={{ height: `${val}%` }}></div>
                          <div className="bar-mini comment" style={{ height: `${val * 0.4}%` }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="graph-days">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <span key={d}>{d}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {stats?.topCategories?.length > 0 && (
              <div className="dashboard-section">
                <h2 className="dashboard-section-title">
                  <i className="fas fa-tags" /> Your Top Categories
                </h2>
                <div className="category-bar-list">
                  {stats.topCategories.map(([cat, count]) => (
                    <div key={cat} className="category-bar-item">
                      <div className="category-bar-label">
                        <span className="category-badge">{cat}</span>
                        <span className="category-bar-count">{count} article{count !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="category-bar-track">
                        <div
                          className="category-bar-fill"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                  <i className="fas fa-history" /> Recent Articles
                </h2>
                <button className="write-new-btn" onClick={() => onNavClick('/write')}>
                  <i className="fas fa-plus" /> New Article
                </button>
              </div>
              {articles.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-pen-fancy" />
                  <h3>No articles yet</h3>
                  <p>Start writing your first article to see stats here!</p>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.slice(0, 10).map(article => (
                        <tr key={article._id}>
                          <td className="title-cell">{article.title}</td>
                          <td><span className="category-badge">{article.category}</span></td>
                          <td>
                            <span className={`status-badge ${article.status || 'published'}`}>
                              {(article.status || 'published').charAt(0).toUpperCase() + (article.status || 'published').slice(1)}
                            </span>
                          </td>
                          <td>{article.views || '0'}</td>
                          <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>{article.date}</td>
                          <td className="actions-cell">
                            <button className="action-btn publish" onClick={() => onNavClick(`/view/${article._id}`)} title="View">
                              <i className="fas fa-eye" />
                            </button>
                            <button className="action-btn publish" onClick={() => onNavClick(`/edit/${article._id}`)} title="Edit">
                              <i className="fas fa-edit" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
