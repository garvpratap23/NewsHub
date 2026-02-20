import { useState, useEffect } from 'react'
import axios from 'axios'
import Hero from '../components/Hero'
import NewsGrid from '../components/NewsGrid'
import Trending from '../components/Trending'
import FeaturedStory from '../components/FeaturedStory'
import Newsletter from '../components/Newsletter'

// Fallback data only used if API fails
const fallbackNewsData = [
  {
    id: 1, title: "Revolutionary AI System Achieves Human-Level Understanding",
    excerpt: "Scientists announce breakthrough in artificial intelligence that could transform how machines interact with humans.",
    category: "tech", categoryLabel: "Technology",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
    author: "Sarah Chen", authorAvatar: "S",
    date: "2 hours ago", readTime: "5 min read", views: "12.5K"
  },
  {
    id: 2, title: "Historic Election Results Reshape Political Landscape",
    excerpt: "Unprecedented voter turnout leads to significant changes in government composition across multiple regions.",
    category: "politics", categoryLabel: "Politics",
    image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600",
    author: "Michael Roberts", authorAvatar: "M",
    date: "4 hours ago", readTime: "8 min read", views: "25.3K"
  },
  {
    id: 3, title: "Championship Finals Break All Viewing Records",
    excerpt: "The most-watched sporting event in history captivates billions of viewers worldwide.",
    category: "sports", categoryLabel: "Sports",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600",
    author: "James Wilson", authorAvatar: "J",
    date: "6 hours ago", readTime: "4 min read", views: "45.7K"
  },
  {
    id: 4, title: "Blockbuster Film Shatters Box Office Records Opening Weekend",
    excerpt: "The highly anticipated sequel exceeds all expectations with unprecedented ticket sales globally.",
    category: "entertainment", categoryLabel: "Entertainment",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600",
    author: "Emily Davis", authorAvatar: "E",
    date: "8 hours ago", readTime: "3 min read", views: "18.9K"
  },
  {
    id: 5, title: "Tech Giants Announce Merger Worth Hundreds of Billions",
    excerpt: "The largest corporate merger in history will reshape the technology industry landscape.",
    category: "business", categoryLabel: "Business",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600",
    author: "David Kim", authorAvatar: "D",
    date: "10 hours ago", readTime: "6 min read", views: "32.1K"
  },
  {
    id: 6, title: "Scientists Discover New Species in Deep Ocean Expedition",
    excerpt: "Remarkable findings from the ocean floor reveal previously unknown life forms.",
    category: "tech", categoryLabel: "Science",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600",
    author: "Dr. Lisa Wang", authorAvatar: "L",
    date: "12 hours ago", readTime: "7 min read", views: "21.4K"
  }
]

const fallbackTrendingData = [
  { id: 1, title: "Cryptocurrency reaches new all-time high amid institutional adoption", views: "125K", comments: 892 },
  { id: 2, title: "Space tourism company announces first civilian mission to Mars", views: "98K", comments: 654 },
  { id: 3, title: "Major cybersecurity breach affects millions of users worldwide", views: "87K", comments: 521 },
  { id: 4, title: "Revolutionary medical breakthrough promises cure for rare diseases", views: "76K", comments: 432 },
  { id: 5, title: "Global shipping crisis impacts holiday shopping season", views: "65K", comments: 321 }
]

export default function HomePage({ showToast, openArticle, onNavClick }) {
  const [newsData, setNewsData] = useState(fallbackNewsData)
  const [trendingData, setTrendingData] = useState(fallbackTrendingData)
  const [userArticles, setUserArticles] = useState([])
  const [liveLoading, setLiveLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Animate on scroll observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

    // Fetch LIVE news from Perplexity on every page load
    setLiveLoading(true)

    // Fetch user-published articles from our database
    const fetchUserArticles = async () => {
      try {
        const res = await axios.get('/api/articles')
        if (res.data?.length > 0) {
          setUserArticles(res.data)
        }
      } catch (err) {
        console.log('User articles fallback:', err.message)
      }
    }

    // Fetch mixed categories for homepage
    const fetchLiveNews = async () => {
      try {
        // Fetch from multiple categories in parallel for a rich homepage
        const categories = ['world', 'technology', 'business']
        const results = await Promise.allSettled(
          categories.map(cat =>
            axios.get(`/api/ai/live-news?category=${cat}`).then(r => r.data)
          )
        )

        let allNews = []
        results.forEach((result, i) => {
          if (result.status === 'fulfilled' && result.value?.length > 0) {
            allNews = allNews.concat(result.value.slice(0, 3))
          }
        })

        if (allNews.length > 0) {
          allNews = allNews.map((n, i) => ({ ...n, id: `live-${i}` }))
          setNewsData(allNews)
        }
      } catch (err) {
        console.log('Live news fallback:', err.message)
      }
      setLiveLoading(false)
    }

    // Fetch LIVE trending
    const fetchTrending = async () => {
      try {
        const res = await axios.get('/api/ai/live-trending')
        if (res.data?.length > 0) setTrendingData(res.data)
      } catch (err) {
        console.log('Trending fallback:', err.message)
      }
    }

    fetchUserArticles()
    fetchLiveNews()
    fetchTrending()

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Hero onNavClick={onNavClick} openArticle={openArticle} />

      {liveLoading && (
        <div className="live-loading-banner">
          <i className="fas fa-satellite-dish" />
          <span>Fetching live news from around the world...</span>
          <div className="live-pulse"></div>
        </div>
      )}

      {userArticles.length > 0 && (
        <section className="user-articles-section">
          <div className="section-header">
            <h2 className="section-title animate-on-scroll">
              <i className="fas fa-pen-nib" /> From Our Authors
            </h2>
            <p className="section-subtitle">Articles published by our community writers</p>
          </div>
          <div className="user-articles-grid">
            {userArticles.map((article, index) => (
              <article
                key={article._id}
                className="user-article-card visible"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onNavClick(`/view/${article._id}`)}
              >
                <div className="user-article-image">
                  <img
                    src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800'}
                    alt={article.title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800' }}
                  />
                  <span className="user-article-category">{article.categoryLabel || article.category}</span>
                </div>
                <div className="user-article-content">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="user-article-footer">
                    <div className="user-article-author">
                      <div className="author-avatar-small">{article.authorAvatar || article.author?.charAt(0)}</div>
                      <span>{article.author}</span>
                    </div>
                    <div className="user-article-stats">
                      <span><i className="fas fa-heart" /> {article.likes?.length || 0}</span>
                      <span><i className="fas fa-comment" /> {article.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <NewsGrid newsData={newsData} showToast={showToast} openArticle={openArticle} />
      <Trending trendingData={trendingData} openArticle={openArticle} />
      <FeaturedStory openArticle={openArticle} />
      <Newsletter showToast={showToast} />
    </>
  )
}
