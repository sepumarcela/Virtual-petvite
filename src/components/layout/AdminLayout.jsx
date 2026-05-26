// src/layouts/AdminLayout.jsx
// Layout principal del panel admin.
// Importa admin.css para sus estilos propios (no afecta la tienda cliente).

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import '../../styles/admin.css'

const NAV = [
  { path: '/admin/dashboard', icon: 'ti-layout-dashboard', label: 'Dashboard' },
  { path: '/admin/productos',  icon: 'ti-package',          label: 'Productos' },
  { path: '/admin/pedidos',    icon: 'ti-shopping-cart',    label: 'Pedidos' },
  { path: '/admin/clientes',   icon: 'ti-users',            label: 'Clientes' },
  { path: '/admin/importar',   icon: 'ti-file-spreadsheet', label: 'Importar' },
]

const TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/productos': 'Gestión de Productos',
  '/admin/pedidos':   'Gestión de Pedidos',
  '/admin/clientes':  'Clientes',
  '/admin/importar':  'Importación masiva',
}

export default function AdminLayout({ children }) {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { adminUser, adminLogout } = useAdminAuth()
  const [collapsed, setCollapsed] = useState(false)

  const title = TITLES[location.pathname] || 'Admin'
  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const handleLogout = () => {
    adminLogout()
    navigate('/admin/login')
  }

  return (
    <div className={`adm-root adm-layout ${collapsed ? 'collapsed' : ''}`}>

      {/* ── SIDEBAR ── */}
      <aside className={`adm-sidebar ${collapsed ? 'collapsed' : ''}`}>
        {/* Brand */}
        <div className="adm-brand">
          <img src="/logo.png" alt="VirtualPet" className="adm-brand-logo" />
          {!collapsed && (
            <div className="adm-brand-texts">
              <span className="adm-brand-name">VirtualPet</span>
              <span className="adm-brand-sub">Panel Admin</span>
            </div>
          )}
          <button className="adm-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            <i className={`ti ${collapsed ? 'ti-chevron-right' : 'ti-chevron-left'}`} />
          </button>
        </div>

        {/* Nav */}
        <nav className="adm-nav">
          {NAV.map((item) => {
            const active = location.pathname === item.path
            return (
              <button
                key={item.path}
                className={`adm-nav-item ${active ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
              >
                <i className={`ti ${item.icon}`} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="adm-sidebar-footer">
          <div className="adm-user-row">
            <div className="adm-avatar">
              {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div className="adm-user-name">{adminUser?.username || 'Admin'}</div>
                <div className="adm-user-role">{adminUser?.rol || 'ADMIN'}</div>
              </div>
            )}
          </div>
          <button className="adm-logout-btn" onClick={handleLogout} title="Cerrar sesión">
            <i className="ti ti-logout" />
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="adm-main-wrapper">
        {/* Topbar */}
        <header className="adm-topbar">
          <div>
            <div className="adm-page-title">{title}</div>
            <div className="adm-page-date">{today}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              className="adm-btn adm-btn-primary adm-btn-sm"
              onClick={() => navigate('/admin/productos')}
            >
              <i className="ti ti-plus" /> Nuevo producto
            </button>
          </div>
        </header>

        {/* Contenido */}
        <main className="adm-content" style={{ animation: 'admFadeIn .25s ease' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
