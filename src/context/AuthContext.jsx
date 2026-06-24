// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('cliniccam_token')
      if (token) {
        try {
          const res = await authApi.getMe()
          setUser(res.data.data)
        } catch {
          localStorage.removeItem('cliniccam_token')
          localStorage.removeItem('cliniccam_user')
        }
      }
      setIsLoading(false)
    }
    init()
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password })
    const { token, user: u } = res.data.data
    localStorage.setItem('cliniccam_token', token)
    localStorage.setItem('cliniccam_user', JSON.stringify(u))
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (data) => {
    const res = await authApi.register(data)
    const { token, user: u } = res.data.data
    localStorage.setItem('cliniccam_token', token)
    localStorage.setItem('cliniccam_user', JSON.stringify(u))
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('cliniccam_token')
    localStorage.removeItem('cliniccam_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user, isLoading,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      isMedecin: user?.role === 'MEDECIN',
      isPatient: user?.role === 'PATIENT',
      login, register, logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être dans un AuthProvider')
  return ctx
}
