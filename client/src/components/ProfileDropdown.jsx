import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ProfileDropdown({ onNavClick, onClose }) {
  const { user, logout, isAdmin, isAuthor } = useAuth()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleNav = (path) => {
    onNavClick(path)
    onClose()
  }

  const handleLogout = () => {
    logout()
    onClose()
    onNavClick('/')
  }

  const getRoleBadgeClass = () => {
    if (isAdmin) return 'role-badge admin'
    if (isAuthor) return 'role-badge author'
    return 'role-badge reader'
  }

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <div className="profile-dropdown-header">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="profile-info">
          <span className="profile-name">{user?.name}</span>
          <span className={getRoleBadgeClass()}>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </span>
        </div>
      </div>

      <div className="profile-dropdown-divider" />


      <div className="profile-dropdown-menu">
        <button className="profile-menu-item" onClick={() => handleNav('/profile')}>
          <i className="fas fa-user" />
          <span>Profile</span>
        </button>
        <button className="profile-menu-item" onClick={() => handleNav('/bookmarks')}>
          <i className="fas fa-bookmark" />
          <span>Bookmarks</span>
        </button>

        {(isAuthor || isAdmin) && (
          <>
            <button className="profile-menu-item" onClick={() => handleNav('/dashboard')}>
              <i className="fas fa-chart-line" />
              <span>Dashboard</span>
            </button>
            <button className="profile-menu-item" onClick={() => handleNav('/write')}>
              <i className="fas fa-pen-fancy" />
              <span>Write Article</span>
            </button>
            <button className="profile-menu-item" onClick={() => handleNav('/my-articles')}>
              <i className="fas fa-newspaper" />
              <span>My Articles</span>
            </button>
          </>
        )}

        {isAdmin && (
          <button className="profile-menu-item admin-item" onClick={() => handleNav('/admin')}>
            <i className="fas fa-shield-alt" />
            <span>Admin Panel</span>
          </button>
        )}
      </div>

      <div className="profile-dropdown-divider" />

      <button className="profile-menu-item logout-item" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt" />
        <span>Logout</span>
      </button>
    </div>
  )
}
