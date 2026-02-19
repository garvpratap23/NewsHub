import { useRef, useEffect } from 'react'

export default function SearchOverlay({ open, onClose }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const handleTagClick = (text) => {
    if (inputRef.current) {
      inputRef.current.value = text
    }
  }

  return (
    <div className={`search-overlay${open ? ' active' : ''}`}>
      <button className="search-close" onClick={onClose}>&times;</button>
      <div className="search-container">
        <div className="search-input-container">
          <input type="text" className="search-input" placeholder="Search for news..." ref={inputRef} />
          <button className="search-submit"><i className="fas fa-search"></i></button>
        </div>
        <div className="search-suggestions">
          <p className="search-suggestions-title">Popular Searches</p>
          <div className="search-tags">
            {['Climate Change', 'Technology', 'Elections', 'Space', 'Cryptocurrency', 'AI'].map(tag => (
              <span key={tag} className="search-tag" onClick={() => handleTagClick(tag)}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
