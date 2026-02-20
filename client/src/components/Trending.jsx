import { useRef, useEffect } from 'react'

export default function Trending({ trendingData, openArticle }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleWheel = (e) => {
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  const handleTrendingClick = (item) => {
    if (openArticle) {
      openArticle({
        id: item.id || item._id,
        title: item.title,
        excerpt: item.title,
        category: 'trending',
        categoryLabel: 'Trending',
        image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800',
        author: 'NewsHub',
        authorAvatar: 'N',
        date: 'Today',
        readTime: '3 min read',
        views: item.views,
        content: item.title
      })
    }
  }

  return (
    <section className="trending">
      <div className="trending-container">
        <h2 className="section-title animate-on-scroll">Trending Now</h2>
        <div className="trending-scroll" ref={scrollRef}>
          {trendingData.map((item, index) => (
            <article
              className="trending-card"
              key={item.id || item._id}
              onClick={() => handleTrendingClick(item)}
              style={{ cursor: 'pointer' }}
            >
              <span className="trending-number">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="trending-title">{item.title}</h3>
              <div className="trending-stats">
                <span className="trending-stat"><i className="far fa-eye"></i> {item.views}</span>
                <span className="trending-stat"><i className="far fa-comment"></i> {item.comments}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
