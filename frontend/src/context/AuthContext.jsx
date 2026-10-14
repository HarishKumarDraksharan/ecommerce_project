import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '@services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('shopsphere_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to restore saved user:', error)
        localStorage.removeItem('shopsphere_user')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await authAPI.login({ email, password })
    const userData = {
      id:           data.userId,
      email:        data.email,
      fullName:     data.fullName,
      roles:        data.roles,
      profileImage: data.profileImage,
      accessToken:  data.accessToken,
      refreshToken: data.refreshToken,
    }
    setUser(userData)
    localStorage.setItem('shopsphere_user', JSON.stringify(userData))
    localStorage.setItem('accessToken',  data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    return userData
  }, [])

  const register = useCallback(async (formData) => {
    return await authAPI.register(formData)
  }, [])

  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Failed to notify server during logout:', error)
    }
    setUser(null)
    localStorage.removeItem('shopsphere_user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    toast.success('Logged out successfully')
  }, [])

  const isAdmin = () => user?.roles?.some(r => r === 'ROLE_ADMIN' || r === 'ROLE_SUPER_ADMIN')
  const isLoggedIn = () => !!user

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('shopsphere_user', JSON.stringify(updated))
  }, [user])

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, logout, register,
      isAdmin, isLoggedIn, updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
