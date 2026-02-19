import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function SignupPage({ onNavClick }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('reader')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password, role)
      onNavClick('/login')
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
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join NewsHub for personalized stories and alerts</p>
          </div>
          {error && <div className="auth-error"><i className="fas fa-exclamation-circle" /> {error}</div>}

          <div className="role-selector">
            <button
              type="button"
              className={`role-option ${role === 'reader' ? 'active' : ''}`}
              onClick={() => setRole('reader')}
            >
              <i className="fas fa-book-reader" />
              <span>Reader</span>
              <small>Read & bookmark articles</small>
            </button>
            <button
              type="button"
              className={`role-option ${role === 'author' ? 'active' : ''}`}
              onClick={() => setRole('author')}
            >
              <i className="fas fa-pen-nib" />
              <span>Author</span>
              <small>Write & publish articles</small>
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-user auth-input-icon"></i>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
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
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            <div className="auth-field">
              <label className="auth-label">Confirm Password</label>
              <div className="auth-input-wrapper">
                <i className="fas fa-lock auth-input-icon"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" required />
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>
            </div>
            <button type="submit" className="auth-submit-btn magnetic" disabled={loading}>
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              {!loading && <i className="fas fa-arrow-right"></i>}
            </button>
          </form>
          <div className="auth-divider">
            <span>OR</span>
          </div>
          <div className="auth-social">
            <button className="auth-social-btn google">
              <i className="fab fa-google"></i>
              <span>Sign up with Google</span>
            </button>
            <button className="auth-social-btn github">
              <i className="fab fa-github"></i>
              <span>Sign up with GitHub</span>
            </button>
          </div>
          <p className="auth-switch">
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('/login') }}>
              Sign In
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
