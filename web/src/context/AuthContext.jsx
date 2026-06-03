import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'sultan_users'
const SESSION_KEY = 'sultan_session'

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY)
    if (sessionId) {
      const users = loadUsers()
      const found = users.find((u) => u.id === sessionId)
      if (found) setUser(found)
      else localStorage.removeItem(SESSION_KEY)
    }
    setLoading(false)
  }, [])

  const persistUser = (updatedUser) => {
    const users = loadUsers()
    const index = users.findIndex((u) => u.id === updatedUser.id)
    if (index >= 0) users[index] = updatedUser
    saveUsers(users)
    setUser(updatedUser)
  }

  const register = ({ username, email, password, server, playerName }) => {
    const users = loadUsers()
    if (users.some((u) => u.email === email)) {
      throw new Error('البريد الإلكتروني مستخدم مسبقاً')
    }
    if (users.some((u) => u.username === username)) {
      throw new Error('اسم المستخدم مستخدم مسبقاً')
    }
    if (password.length < 6) {
      throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    }

    const newUser = {
      id: crypto.randomUUID(),
      username,
      email,
      password,
      server: server || '',
      playerName: playerName || '',
      plan: 'free',
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)
    localStorage.setItem(SESSION_KEY, newUser.id)
    setUser(newUser)
    return newUser
  }

  const login = ({ email, password }) => {
    const users = loadUsers()
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) throw new Error('البريد أو كلمة المرور غير صحيحة')

    localStorage.setItem(SESSION_KEY, found.id)
    setUser(found)
    return found
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const updateProfile = (fields) => {
    if (!user) return
    persistUser({ ...user, ...fields })
  }

  const upgradeToPremium = () => {
    if (!user) return
    persistUser({ ...user, plan: 'premium' })
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout, updateProfile, upgradeToPremium }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
