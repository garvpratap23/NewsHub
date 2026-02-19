import { useState } from 'react'

export default function Newsletter({ showToast }) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    showToast('Successfully subscribed to newsletter!')
    setEmail('')
  }

  return (
    <section className="newsletter">
      <div className="newsletter-container animate-on-scroll">
        <h2 className="newsletter-title">Stay Informed</h2>
        <p className="newsletter-text">Get the latest news delivered straight to your inbox. No spam, just quality journalism.</p>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="newsletter-btn magnetic">Subscribe</button>
        </form>
      </div>
    </section>
  )
}
