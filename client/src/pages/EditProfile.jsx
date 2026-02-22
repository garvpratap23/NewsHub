import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

export default function EditProfile({ onNavClick, showToast }) {
  const { user, token, setUser, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [loading, setLoading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleAvatarUpload = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }
    setAvatarUploading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setAvatar(data.url)
      if (showToast) showToast('Photo uploaded!')
    } catch (err) {
      setError('Upload failed: ' + err.message)
    }
    setAvatarUploading(false)
  }

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
        body: JSON.stringify({ name, avatar })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      updateUser(data)
      setSuccess(true)
      if (showToast) showToast('Profile updated!')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <section className="edit-profile-page">
      <div className="edit-profile-container">
        <h1 className="edit-profile-title">
          <i className="fas fa-user-edit" /> Edit Profile
        </h1>

        {/* Avatar upload */}
        <div className="avatar-upload-section">
          <div className="avatar-upload-preview" onClick={() => fileInputRef.current?.click()}>
            {avatar ? (
              <img src={avatar} alt="Avatar" className="avatar-upload-img" />
            ) : (
              <div className="avatar-upload-initials">{initials}</div>
            )}
            <div className="avatar-upload-overlay">
              {avatarUploading ? (
                <i className="fas fa-spinner fa-spin" />
              ) : (
                <i className="fas fa-camera" />
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={async (e) => {
              const file = e.target.files[0]
              if (file) await handleAvatarUpload(file)
              e.target.value = ''
            }}
          />
          <span className="avatar-upload-hint">Click to change photo</span>
          {avatar && (
            <button type="button" className="avatar-remove-btn" onClick={() => setAvatar('')}>
              <i className="fas fa-trash-alt" /> Remove Photo
            </button>
          )}
        </div>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="edit-profile-field">
            <label className="edit-profile-label">Name</label>
            <input
              type="text"
              className="edit-profile-input"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="edit-profile-field">
            <label className="edit-profile-label">Email</label>
            <input
              type="email"
              className="edit-profile-input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
          </div>

          {error && <div className="edit-profile-error"><i className="fas fa-exclamation-circle" /> {error}</div>}
          {success && <div className="edit-profile-success"><i className="fas fa-check-circle" /> Profile updated!</div>}

          <div className="edit-profile-actions">
            <button type="button" className="edit-profile-btn cancel" onClick={() => onNavClick && onNavClick('/')}>Cancel</button>
            <button type="submit" className="edit-profile-btn save" disabled={loading}>
              {loading ? 'Saving...' : <><i className="fas fa-save" /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
