import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import NewsGrid from '../components/NewsGrid'
import Newsletter from '../components/Newsletter'

const categoryMap = {
  world: { label: 'World News', heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200' },
  politics: { label: 'Politics', heroImage: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200' },
  technology: { label: 'Technology', heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200' },
  sports: { label: 'Sports', heroImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200' },
  entertainment: { label: 'Entertainment', heroImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200' },
  business: { label: 'Business', heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200' },
  science: { label: 'Science', heroImage: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200' },
  health: { label: 'Health', heroImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200' },
}

export default function CategoryPage({ showToast, openArticle }) {
  const { category } = useParams()
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)
  const catInfo = categoryMap[category] || { label: category?.charAt(0).toUpperCase() + category?.slice(1), heroImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200' }

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    setNewsData([])

    // Animate on scroll observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

    // Fetch 15 live articles for this category from Perplexity
    const fetchLiveNews = async () => {
      try {
        const res = await axios.get(`/api/ai/live-news?category=${category}`)
        if (res.data?.length > 0) {
          setNewsData(res.data.map((n, i) => ({ ...n, id: `live-${category}-${i}` })))
        }
      } catch (err) {
        console.log('Live category news fallback:', err.message)
        // Fallback: try fetching from DB
        try {
          const res2 = await axios.get(`/api/news?category=${category}`)
          if (res2.data?.length > 0) setNewsData(res2.data)
        } catch (e) { }
      }
      setLoading(false)
    }

    fetchLiveNews()

    return () => observer.disconnect()
  }, [category])

  return (
    <>
      <section className="hero" style={{ minHeight: '60vh' }}>
        <div className="hero-bg">
          <div className="hero-bg-gradient"></div>
          <div className="hero-bg-gradient"></div>
        </div>
        <div className="hero-content" style={{ gridTemplateColumns: '1fr' }}>
          <div className="hero-text">
            <h1>
              <span>{catInfo.label}</span><br />
              <span className="highlight glitch" data-text="News">News</span>
            </h1>
            <p>Stay updated with the latest {catInfo.label.toLowerCase()} stories from around the world.</p>
          </div>
        </div>
      </section>

      {loading && (
        <div className="live-loading-banner">
          <i className="fas fa-satellite-dish" />
          <span>Fetching live {catInfo.label.toLowerCase()} news...</span>
          <div className="live-pulse"></div>
        </div>
      )}

      <NewsGrid newsData={newsData} showToast={showToast} openArticle={openArticle} showTabs={false} />

      <Newsletter showToast={showToast} />
    </>
  )
}
