import { useAuth } from '../context/AuthContext'

export default function ProfilePage({ onNavClick }) {
  const { user, isAdmin, isAuthor } = useAuth()

  const getRoleLabel = () => {
    if (isAdmin) return 'Admin'
    if (isAuthor) return 'Author'
    return 'Reader'
  }

  const getRoleColor = () => {
    if (isAdmin) return '#ff4757'
    if (isAuthor) return '#ffa502'
    return '#1e90ff'
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A'

  return (
    <section className="profile-page" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
      <div style={{
        background: 'rgba(20,20,20,0.95)',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        maxWidth: 480,
        width: '100%',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        {/* Header banner */}
        <div style={{
          height: 100,
          background: 'linear-gradient(135deg, #ff6600 0%, #ff8533 50%, #e65c00 100%)',
          position: 'relative'
        }} />

        {/* Avatar */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: -48 }}>
          <div style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff6600, #ff8533)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            fontWeight: 800,
            color: '#fff',
            border: '4px solid rgba(20,20,20,0.95)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            textTransform: 'uppercase',
            letterSpacing: 1
          }}>
            {user?.name?.charAt(0) || '?'}
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '20px 32px 32px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 6px', color: '#fff' }}>
            {user?.name || 'Unknown'}
          </h1>

          <span style={{
            display: 'inline-block',
            padding: '4px 16px',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 700,
            color: '#fff',
            background: getRoleColor(),
            marginBottom: 28,
            letterSpacing: 0.5,
            textTransform: 'uppercase'
          }}>
            {getRoleLabel()}
          </span>

          {/* Details */}
          <div style={{ textAlign: 'left' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              <i className="fas fa-envelope" style={{ color: '#ff6600', fontSize: 16, width: 20, textAlign: 'center' }} />
              <div>
                <div style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Email</div>
                <div style={{ color: '#ddd', fontSize: 15 }}>{user?.email || 'N/A'}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 0',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              <i className="fas fa-calendar-alt" style={{ color: '#ff6600', fontSize: 16, width: 20, textAlign: 'center' }} />
              <div>
                <div style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Member Since</div>
                <div style={{ color: '#ddd', fontSize: 15 }}>{memberSince}</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 0'
            }}>
              <i className="fas fa-shield-alt" style={{ color: '#ff6600', fontSize: 16, width: 20, textAlign: 'center' }} />
              <div>
                <div style={{ fontSize: 11, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Role</div>
                <div style={{ color: '#ddd', fontSize: 15 }}>{getRoleLabel()}</div>
              </div>
            </div>
          </div>

          {/* Edit Profile button */}
          <button
            onClick={() => onNavClick && onNavClick('/edit-profile')}
            style={{
              marginTop: 28,
              width: '100%',
              padding: '12px 0',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #ff6600, #ff8533)',
              color: '#fff',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <i className="fas fa-user-edit" />
            Edit Profile
          </button>
        </div>
      </div>
    </section>
  )
}
