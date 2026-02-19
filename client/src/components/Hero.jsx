export default function Hero({ onNavClick }) {
  const handleExplore = (e) => {
    e.preventDefault()
    const newsSection = document.querySelector('.news-grid-section') || document.querySelector('.news-grid')
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  const handleWatchLive = (e) => {
    e.preventDefault()
    if (onNavClick) onNavClick('/world')
  }

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-gradient"></div>
      </div>
      <div className="hero-content">
        <div className="hero-text">
          <h1>
            <span>The Future</span><br />
            <span>of</span> <span className="highlight glitch" data-text="News">News</span><br />
            <span>Starts Here</span>
          </h1>
          <p>Experience journalism reimagined with immersive storytelling, real-time updates, and personalized content that keeps you ahead of the curve.</p>
          <div className="hero-buttons">
            <a href="#" className="btn btn-primary magnetic" onClick={handleExplore}>
              <span>Explore Stories</span>
              <i className="fas fa-arrow-right"></i>
            </a>
            <a href="#" className="btn btn-outline magnetic" onClick={handleWatchLive}>
              <span>Watch Live</span>
              <i className="fas fa-play"></i>
            </a>
          </div>
        </div>
        <div className="hero-featured">
          <div className="featured-card">
            <span className="featured-badge">🔴 LIVE</span>
            <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600" alt="Featured News" className="featured-image" />
            <div className="featured-content">
              <span className="featured-category">Breaking News</span>
              <h3 className="featured-title">Global Leaders Unite for Historic Climate Agreement</h3>
              <div className="featured-meta">
                <span><i className="far fa-clock"></i> 2 hours ago</span>
                <span><i className="far fa-eye"></i> 15.2K views</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
