import { useCallback } from 'react'

export default function Footer({ onNavClick }) {
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

  return (
    <footer>
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="footer-logo" onClick={(e) => { e.preventDefault(); onNavClick('/') }}>NewsHub</a>
            <p className="footer-desc">Delivering trusted news and insightful analysis since 2024. Our commitment to journalism excellence drives everything we do.</p>
            <div className="footer-social">
              <a href="#" className="social-link magnetic" onMouseMove={handleMagnetic} onMouseLeave={resetMagnetic}><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-link magnetic" onMouseMove={handleMagnetic} onMouseLeave={resetMagnetic}><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-link magnetic" onMouseMove={handleMagnetic} onMouseLeave={resetMagnetic}><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-link magnetic" onMouseMove={handleMagnetic} onMouseLeave={resetMagnetic}><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Categories</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavClick('/world') }}>World News</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavClick('/politics') }}>Politics</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavClick('/technology') }}>Technology</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavClick('/sports') }}>Sports</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onNavClick('/entertainment') }}>Entertainment</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Advertise</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4 className="footer-title">Legal</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 NewsHub. All rights reserved.</p>
          <p>Made with ❤️ for journalism</p>
        </div>
      </div>
    </footer>
  )
}
