

import { createContext, useContext, useState, useEffect } from 'react'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [adminUser,  setAdminUser]  = useState(null)
  const [adminToken, setAdminToken] = useState(localStorage.getItem('vp_admin_token'))
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('vp_admin_user')
    if (stored) {
      try { setAdminUser(JSON.parse(stored)) } catch (_) {}
    }
    setLoading(false)
  }, [])

  const adminLogin = (tokenValue, userData) => {
    localStorage.setItem('vp_admin_token', tokenValue)
    localStorage.setItem('vp_admin_user', JSON.stringify(userData))
    setAdminToken(tokenValue)
    setAdminUser(userData)
  }

  const adminLogout = () => {
    localStorage.removeItem('vp_admin_token')
    localStorage.removeItem('vp_admin_user')
    setAdminToken(null)
    setAdminUser(null)
  }

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      adminToken,
      loading,
      adminLogin,
      adminLogout,
      isAdminAuthenticated: !!adminToken,
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth debe usarse dentro de AdminAuthProvider')
  return ctx
}
