import { useRef, useEffect } from 'react'

export default function Trending({ trendingData }) {
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

  return (
    <section className="trending">
      <div className="trending-container">
        <h2 className="section-title animate-on-scroll">Trending Now</h2>
        <div className="trending-scroll" ref={scrollRef}>
          {trendingData.map((item, index) => (
            <article className="trending-card" key={item.id || item._id}>
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
