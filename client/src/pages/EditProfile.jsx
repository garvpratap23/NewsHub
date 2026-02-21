import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function EditProfile({ onNavClick, showToast }) {
  const { user, token, setUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setUser(data)
      setSuccess(true)
      if (showToast) showToast('Profile updated!')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <section className="edit-profile-page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="edit-profile-container" style={{ background: 'rgba(20,20,20,0.95)', padding: 32, borderRadius: 16, boxShadow: '0 2px 16px #0008', minWidth: 320, maxWidth: 400, width: '100%' }}>
        <h1 className="edit-profile-title" style={{ fontSize: 32, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}><i className="fas fa-user-edit" /> Edit Profile</h1>
        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="edit-profile-field" style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #333', background: '#181818', color: '#fff', fontSize: 16 }}
            />
          </div>
          {error && <div className="edit-profile-error" style={{ color: '#ff3838', marginBottom: 12 }}>{error}</div>}
          {success && <div className="edit-profile-success" style={{ color: '#27ae60', marginBottom: 12 }}>Profile updated!</div>}
          <div className="edit-profile-actions" style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" onClick={() => onNavClick && onNavClick('/')} style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: 'none', background: '#222', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: 'none', background: '#ff6600', color: '#fff', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </section>
  )
}
