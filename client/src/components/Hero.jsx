export default function Hero({ onNavClick, openArticle }) {
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

  const handleFeaturedClick = () => {
    if (openArticle) {
      openArticle({
        id: 'featured-breaking',
        title: 'Global Leaders Unite for Historic Climate Agreement',
        excerpt: 'In a landmark decision, world leaders have come together to sign the most comprehensive climate agreement in history, pledging unprecedented commitments to combat global warming.',
        category: 'world',
        categoryLabel: 'Breaking News',
        image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600',
        author: 'NewsHub Live',
        authorAvatar: 'N',
        date: '2 hours ago',
        readTime: '8 min read',
        views: '15.2K',
        content: `Global Leaders Unite for Historic Climate Agreement

In an unprecedented show of international unity, leaders from over 190 countries have signed what experts are calling the most ambitious climate agreement in human history.

The agreement, reached after intense negotiations at the Global Climate Summit, sets binding targets for carbon emission reductions that far exceed previous commitments. Key provisions include:

• A commitment to achieve net-zero emissions by 2045 for developed nations
• Establishment of a $500 billion annual climate fund for developing countries
• Mandatory phase-out of coal power by 2035
• Investment in renewable energy infrastructure

"This is the moment history will remember," said the UN Secretary-General. "For the first time, the world has truly united to face our greatest challenge."

Environmental groups have cautiously welcomed the agreement, while industry leaders are already planning the transition to cleaner technologies. The agreement goes into effect immediately, with the first progress reviews scheduled for next year.`
      })
    }
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
          <div className="featured-card" onClick={handleFeaturedClick} style={{ cursor: 'pointer' }}>
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
