import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

// Safe JSON parser — prevents "Unexpected end of JSON input" when server returns empty/HTML response
async function safeJson(res) {
  const text = await res.text()
  if (!text || text.trim() === '') {
    throw new Error(`Server returned an empty response (status ${res.status}). Make sure the server is running.`)
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`Server returned an unexpected response (status ${res.status}). Check the server console for errors.`)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await safeJson(res)
    if (!res.ok) throw new Error(data.message || 'Login failed')

    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return data
  }, [])

  const register = useCallback(async (name, email, password, role) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
    const data = await safeJson(res)
    if (!res.ok) throw new Error(data.message || 'Registration failed')
    return data
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'
  const isAuthor = user?.role === 'author'
  const isReader = user?.role === 'reader'

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, register, logout,
      isAuthenticated, isAdmin, isAuthor, isReader
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
