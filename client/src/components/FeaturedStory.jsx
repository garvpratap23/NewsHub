export default function FeaturedStory({ openArticle }) {
  const handleClick = (e) => {
    e.preventDefault()
    if (openArticle) {
      openArticle({
        id: 'editors-pick',
        title: 'The Digital Revolution: How AI is Reshaping Every Industry',
        excerpt: 'From healthcare to finance, artificial intelligence is transforming the way we live and work. Our in-depth investigation reveals the opportunities and challenges ahead.',
        category: 'technology',
        categoryLabel: 'Technology',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        author: 'NewsHub Editors',
        authorAvatar: 'N',
        date: 'Dec 15, 2024',
        readTime: '15 min read',
        views: '234K',
        content: `The Digital Revolution: How AI is Reshaping Every Industry

Artificial intelligence is no longer science fiction—it's the driving force behind a global transformation that touches every aspect of our lives. From the way we receive medical diagnoses to how financial markets operate, AI is rewriting the rules of engagement across industries.

In healthcare, AI-powered diagnostic tools are achieving accuracy rates that rival—and sometimes exceed—those of human specialists. Machine learning algorithms can now detect early signs of cancer in medical imaging, predict patient outcomes, and even assist in drug discovery processes that once took decades.

The financial sector has embraced AI for fraud detection, algorithmic trading, and personalized banking experiences. Robo-advisors manage billions in assets, while AI systems monitor transactions in real-time to identify suspicious activities.

Manufacturing has seen perhaps the most visible transformation. Smart factories powered by AI can predict equipment failures before they occur, optimize production schedules, and maintain quality control with unprecedented precision.

But with great power comes great responsibility. The rise of AI raises critical questions about privacy, job displacement, and algorithmic bias. As we stand at this technological crossroads, the choices we make today will shape the world of tomorrow.

The digital revolution is not coming—it's already here. The question is not whether AI will change our world, but how we will adapt to thrive in it.`
      })
    }
  }

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
          <a href="#" className="read-more-btn magnetic" onClick={handleClick}>
            <span>Read Full Story</span>
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  )
}
