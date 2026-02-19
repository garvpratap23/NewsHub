import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Cursor from './components/Cursor'
import Loader from './components/Loader'
import ScrollProgress from './components/ScrollProgress'
import Header from './components/Header'
import Ticker from './components/Ticker'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import SearchOverlay from './components/SearchOverlay'
import Toast from './components/Toast'
import ArticleModal from './components/ArticleModal'
import WeatherWidget from './components/WeatherWidget'
import PageTransition from './components/PageTransition'
import Chatbot from './components/Chatbot'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AdminPanel from './pages/AdminPanel'
import WriteArticle from './pages/WriteArticle'
import MyArticles from './pages/MyArticles'
import BookmarksPage from './pages/BookmarksPage'
import AuthorDashboard from './pages/AuthorDashboard'
import EditArticle from './pages/EditArticle'
import ViewArticle from './pages/ViewArticle'

function EditArticleWrapper({ onNavClick, showToast }) {
  const { id } = useParams()
  return <EditArticle onNavClick={onNavClick} showToast={showToast} articleId={id} />
}

function ViewArticleWrapper({ onNavClick, setCurrentViewArticle }) {
  const { id } = useParams()
  return <ViewArticle onNavClick={onNavClick} articleId={id} setCurrentViewArticle={setCurrentViewArticle} />
}

function AppContent() {
  const [loaded, setLoaded] = useState(false)
  const [tickerVisible, setTickerVisible] = useState(false)
  const [weatherVisible, setWeatherVisible] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [articleModalData, setArticleModalData] = useState(null)
  const [currentViewArticle, setCurrentViewArticle] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove('light-mode')
    } else {
      document.body.classList.add('light-mode')
    }
  }, [darkMode])

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true)
      setTimeout(() => {
        setTickerVisible(true)
        setWeatherVisible(true)
      }, 500)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  const showToast = useCallback((message) => {
    setToastMessage(message)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }, [])

  const openArticle = useCallback((news) => {
    setArticleModalData(news)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeArticle = useCallback(() => {
    setArticleModalData(null)
    document.body.style.overflow = ''
  }, [])

  const handleNavClick = useCallback((path) => {
    setTransitioning(true)
    setMobileMenuOpen(false)
    setTimeout(() => {
      navigate(path)
      window.scrollTo(0, 0)
    }, 500)
    setTimeout(() => {
      setTransitioning(false)
    }, 1000)
  }, [navigate])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        closeArticle()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeArticle])

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup'
  const isSpecialPage = ['/admin', '/write', '/my-articles', '/bookmarks', '/dashboard'].includes(location.pathname) ||
    location.pathname.startsWith('/edit/') || location.pathname.startsWith('/view/')

  return (
    <>
      <Cursor />
      <PageTransition active={transitioning} />
      <Loader visible={!loaded} />
      <ScrollProgress />
      <Header
        onSearchClick={() => setSearchOpen(true)}
        onNavClick={handleNavClick}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      {!isAuthPage && !isSpecialPage && <Ticker visible={tickerVisible} />}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              showToast={showToast}
              openArticle={openArticle}
              onNavClick={handleNavClick}
            />
          }
        />
        <Route path="/login" element={<LoginPage onNavClick={handleNavClick} />} />
        <Route path="/signup" element={<SignupPage onNavClick={handleNavClick} />} />
        <Route path="/admin" element={<AdminPanel onNavClick={handleNavClick} />} />
        <Route path="/write" element={<WriteArticle onNavClick={handleNavClick} showToast={showToast} />} />
        <Route path="/my-articles" element={<MyArticles onNavClick={handleNavClick} showToast={showToast} />} />
        <Route path="/bookmarks" element={<BookmarksPage openArticle={openArticle} />} />
        <Route path="/dashboard" element={<AuthorDashboard onNavClick={handleNavClick} />} />
        <Route path="/edit/:id" element={<EditArticleWrapper onNavClick={handleNavClick} showToast={showToast} />} />
        <Route path="/view/:id" element={<ViewArticleWrapper onNavClick={handleNavClick} setCurrentViewArticle={setCurrentViewArticle} />} />
        <Route
          path="/:category"
          element={
            <CategoryPage
              showToast={showToast}
              openArticle={openArticle}
            />
          }
        />
      </Routes>

      {!isAuthPage && !isSpecialPage && <Footer onNavClick={handleNavClick} />}
      <BackToTop />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toast message={toastMessage} visible={toastVisible} />
      <ArticleModal data={articleModalData} onClose={closeArticle} showToast={showToast} />
      {!isAuthPage && !isSpecialPage && <WeatherWidget visible={weatherVisible} />}
      {!isAuthPage && <Chatbot articleContext={articleModalData || currentViewArticle} />}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
