import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage({ onNavClick }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      onNavClick('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-bg">
        <div className="hero-bg-gradient"></div>
        <div className="hero-bg-gradient"></div>
      </div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-logo">NewsHub</h1>
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to access your personalized news feed</p>
          </div>
          {error && <div className="auth-error"><i className="fas fa-exclamation-circle" /> {error}</div>}
          <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-envelope auth-input-icon"></i>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  name="login-email"
                />
              </div>
            </div>
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-lock auth-input-icon"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  name="login-password"
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="auth-forgot">Forgot Password?</a>
            </div>
            <button type="submit" className="auth-submit-btn magnetic" disabled={loading}>
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              {!loading && <i className="fas fa-arrow-right"></i>}
            </button>
          </form>
          <div className="auth-divider">
            <span>OR</span>
          </div>
          <div className="auth-social">
            <button className="auth-social-btn google">
              <i className="fab fa-google"></i>
              <span>Continue with Google</span>
            </button>
            <button className="auth-social-btn github">
              <i className="fab fa-github"></i>
              <span>Continue with GitHub</span>
            </button>
          </div>
          <p className="auth-switch">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('/signup') }}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
