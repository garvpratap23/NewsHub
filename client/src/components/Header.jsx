import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ProfileDropdown from './ProfileDropdown'
import NavWeather from './NavWeather'

export default function Header({ onSearchClick, onNavClick, mobileMenuOpen, setMobileMenuOpen, darkMode, setDarkMode }) {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false)
  }, [location.pathname])

  const navItems = [
    { label: 'Home', path: '/', page: 'home' },
    { label: 'World', path: '/world', page: 'world' },
    { label: 'Politics', path: '/politics', page: 'politics' },
    { label: 'Technology', path: '/technology', page: 'technology' },
    { label: 'Sports', path: '/sports', page: 'sports' },
    { label: 'Entertainment', path: '/entertainment', page: 'entertainment' },
  ]

  const handleMagnetic = useCallback((e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`
  }, [])

  const resetMagnetic = useCallback((e) => {
    e.currentTarget.style.transform = 'translate(0, 0)'
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <nav>
        <a
          href="#"
          className="logo magnetic"
          onClick={(e) => { e.preventDefault(); onNavClick('/') }}
          onMouseMove={handleMagnetic}
          onMouseLeave={resetMagnetic}
        >
          NewsHub
        </a>
        <ul className={`nav-links${mobileMenuOpen ? ' active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.page}>
              <a
                href="#"
                className="magnetic"
                data-page={item.page}
                onClick={(e) => { e.preventDefault(); onNavClick(item.path) }}
                onMouseMove={handleMagnetic}
                onMouseLeave={resetMagnetic}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <NavWeather />
          <button
            className="nav-btn magnetic"
            onClick={onSearchClick}
            onMouseMove={handleMagnetic}
            onMouseLeave={resetMagnetic}
            title="Search"
          >
            <i className="fas fa-search"></i>
          </button>
          <button
            className="nav-btn magnetic"
            onClick={toggleDarkMode}
            onMouseMove={handleMagnetic}
            onMouseLeave={resetMagnetic}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>

          {isAuthenticated ? (
            <div className="profile-btn-wrapper">
              <button
                className="nav-btn profile-btn magnetic"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseMove={handleMagnetic}
                onMouseLeave={resetMagnetic}
                title="Profile"
              >
                <div className="nav-avatar">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </button>
              {dropdownOpen && (
                <ProfileDropdown
                  onNavClick={onNavClick}
                  onClose={() => setDropdownOpen(false)}
                />
              )}
            </div>
          ) : (
            <>
              <button
                className="nav-btn magnetic"
                onClick={(e) => { e.preventDefault(); onNavClick('/login') }}
                onMouseMove={handleMagnetic}
                onMouseLeave={resetMagnetic}
                title="Login"
              >
                <i className="fas fa-user"></i>
              </button>
              <button
                className="subscribe-btn magnetic"
                onMouseMove={handleMagnetic}
                onMouseLeave={resetMagnetic}
                onClick={() => onNavClick('/signup')}
              >
                Subscribe
              </button>
            </>
          )}

          <button
            className={`menu-toggle${mobileMenuOpen ? ' active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>
  )
}
