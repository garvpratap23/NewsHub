import { useRef, useEffect, useState } from 'react'

export default function SearchOverlay({ open, onClose, onNavClick }) {
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
      setQuery('')
      setResults([])
    }
  }, [open])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 2) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/articles/search?q=${encodeURIComponent(query)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data)
        }
      } catch (err) {
        console.error('Search error:', err)
      }
      setLoading(false)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const handleTagClick = (text) => {
    setQuery(text)
    if (inputRef.current) {
      inputRef.current.value = text
    }
  }

  const handleResultClick = (article) => {
    onClose()
    if (onNavClick) {
      onNavClick(`/view/${article._id}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Results are already shown via debounce
  }

  return (
    <div className={`search-overlay${open ? ' active' : ''}`}>
      <button className="search-close" onClick={onClose}>&times;</button>
      <div className="search-container">
        <form onSubmit={handleSubmit}>
          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for news..."
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-submit"><i className="fas fa-search"></i></button>
          </div>
        </form>

        {loading && (
          <div className="search-loading">
            <i className="fas fa-spinner fa-spin"></i> Searching...
          </div>
        )}

        {results.length > 0 && (
          <div className="search-results">
            <p className="search-results-title">Results ({results.length})</p>
            <div className="search-results-list">
              {results.map(article => (
                <div
                  key={article._id}
                  className="search-result-item"
                  onClick={() => handleResultClick(article)}
                >
                  <div className="search-result-image">
                    <img
                      src={article.image || 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=200'}
                      alt={article.title}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=200' }}
                    />
                  </div>
                  <div className="search-result-content">
                    <span className="search-result-category">{article.categoryLabel || article.category}</span>
                    <h4>{article.title}</h4>
                    <p>{article.excerpt?.substring(0, 100)}...</p>
                    <div className="search-result-meta">
                      <span><i className="far fa-user"></i> {article.author}</span>
                      <span><i className="far fa-clock"></i> {article.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {query.length >= 2 && !loading && results.length === 0 && (
          <div className="search-no-results">
            <i className="fas fa-search"></i>
            <p>No articles found for "{query}"</p>
          </div>
        )}

        {query.length < 2 && (
          <div className="search-suggestions">
            <p className="search-suggestions-title">Popular Searches</p>
            <div className="search-tags">
              {['Climate Change', 'Technology', 'Elections', 'Space', 'Cryptocurrency', 'AI'].map(tag => (
                <span key={tag} className="search-tag" onClick={() => handleTagClick(tag)}>{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
