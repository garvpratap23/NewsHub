import { useEffect, useRef, useState } from 'react'

export default function NewsGrid({ newsData, showToast, openArticle, showTabs = true }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const gridRef = useRef(null)

  const filteredNews = activeCategory === 'all'
    ? newsData
    : newsData.filter(n => n.category === activeCategory)

  useEffect(() => {
    if (!gridRef.current) return
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    gridRef.current.querySelectorAll('.news-card').forEach(card => {
      observer.observe(card)
    })

    return () => observer.disconnect()
  }, [filteredNews])

  const handleBookmark = (e, id) => {
    e.stopPropagation()
    const icon = e.currentTarget.querySelector('i')
    icon.classList.toggle('far')
    icon.classList.toggle('fas')
    e.currentTarget.classList.toggle('bookmarked')
    showToast('Article saved to bookmarks')
  }

  const handleShare = (e) => {
    e.stopPropagation()
    showToast('Link copied to clipboard!')
  }

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800'
    e.target.onerror = null // Prevent infinite loop
  }

  const renderAvatar = (author, avatar) => {
    if (!avatar || avatar.length === 1) {
      return (
        <div className="author-avatar-initial">
          {avatar || (author ? author.charAt(0) : '?')}
        </div>
      )
    }
    return (
      <img
        src={avatar}
        alt={author}
        className="author-avatar"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
    )
  }

  return (
    <section className="categories">
      <div className="section-header">
        <h2 className="section-title animate-on-scroll">Latest Stories</h2>
        {showTabs && (
          <div className="category-tabs">
            {[
              { key: 'all', label: 'All' },
              { key: 'tech', label: 'Technology' },
              { key: 'politics', label: 'Politics' },
              { key: 'sports', label: 'Sports' },
              { key: 'entertainment', label: 'Entertainment' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`category-tab magnetic${activeCategory === tab.key ? ' active' : ''}`}
                data-category={tab.key}
                onClick={() => setActiveCategory(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="news-grid" ref={gridRef}>
        {filteredNews.map((news, index) => (
          <article
            key={news.id || news._id}
            className="news-card"
            style={{ transitionDelay: `${index * 0.1}s` }}
            onClick={() => openArticle(news)}
          >
            <div style={{ overflow: 'hidden', borderRadius: '20px 20px 0 0', height: '200px', background: 'rgba(255,255,255,0.05)' }}>
              <img
                src={news.image}
                alt=""
                className="news-card-image"
                onError={handleImageError}
              />
              <div className="news-card-overlay"></div>
            </div>
            <div className="news-card-body">
              <span className={`news-card-category ${news.category}`}>{news.categoryLabel}</span>
              <h3 className="news-card-title">{news.title}</h3>
              <p className="news-card-excerpt">{news.excerpt}</p>
              <div className="news-card-footer">
                <div className="news-card-author">
                  <div className="avatar-container">
                    {renderAvatar(news.author, news.authorAvatar)}
                    <div className="author-avatar-initial fallback" style={{ display: 'none' }}>
                      {news.author ? news.author.charAt(0) : '?'}
                    </div>
                  </div>
                  <span className="author-name">{news.author}</span>
                </div>
                <div className="news-card-actions">
                  <button className="card-action bookmark-btn" onClick={(e) => handleBookmark(e, news.id)}>
                    <i className="far fa-bookmark"></i>
                  </button>
                  <button className="card-action share-btn" onClick={handleShare}>
                    <i className="fas fa-share"></i>
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
