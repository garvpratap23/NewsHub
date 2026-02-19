export default function FeaturedStory() {
  return (
    <section className="featured-story">
      <div className="story-container animate-on-scroll">
        <div className="story-image-container">
          <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800" alt="Featured Story" className="story-image" />
        </div>
        <div className="story-content">
          <div className="story-label">
            <i className="fas fa-star"></i>
            <span>Editor's Pick</span>
          </div>
          <h2 className="story-title">The Digital Revolution: How AI is Reshaping Every Industry</h2>
          <p className="story-excerpt">From healthcare to finance, artificial intelligence is transforming the way we live and work. Our in-depth investigation reveals the opportunities and challenges ahead.</p>
          <div className="story-meta">
            <div className="story-meta-item">
              <i className="far fa-clock"></i>
              <span>15 min read</span>
            </div>
            <div className="story-meta-item">
              <i className="far fa-calendar"></i>
              <span>Dec 15, 2024</span>
            </div>
            <div className="story-meta-item">
              <i className="far fa-comment"></i>
              <span>234 comments</span>
            </div>
          </div>
          <a href="#" className="read-more-btn magnetic">
            <span>Read Full Story</span>
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  )
}
