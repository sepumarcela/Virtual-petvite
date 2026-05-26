// components/layout/Navbar.jsx
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const TEAL      = '#F5F5F5'
const DARK_TEAL = '#1E5F61'
const ORANGE    = '#D4883B'

const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="white">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

export default function Navbar() {
  const { totalItems } = useCart()
  const { isAuthenticated, user } = useAuth()

  return (
    <header>
      {/* ── Barra superior ── */}
      <div style={{
        background: DARK_TEAL, color: '#fff',
        fontSize: '0.78rem', padding: '0.45rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span>📞 +57 300 910 8496</span>
          <span>🛡️ Compras seguras online</span>
          <span>💳 Pago contra entrega</span>
          <span>🚚 Entregas el mismo día</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ opacity: 0.85 }}>Síguenos en redes</span>
          <a href="https://facebook.com" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center' }}><FacebookIcon /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center' }}><InstagramIcon /></a>
        </div>
      </div>

      {/* ── Barra principal ── */}
      <nav style={{
        background: TEAL,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.5rem 2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        {/* Logo imagen */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img
            src="/logo.png"
            alt="VirtualPet"
            style={{
              height: 52,
              objectFit: 'contain',
            }}
          />
        </Link>

        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>

          {/* 🏠 Inicio */}
          <NavBtn to="/" label="🏠" title="Inicio" />

          {/* 🛍️ Productos */}
          <NavBtn to="/products" label="🛍️" title="Productos" />

          {/* 🛒 Carrito con badge */}
          <Link to="/cart" title="Carrito" style={{ textDecoration: 'none' }}>
            <div style={{
              ...btnBase,
              display: 'flex', alignItems: 'center', gap: '0.3rem',
            }}>
              <span style={{ fontSize: '1.3rem' }}>🛒</span>
              {totalItems > 0 && (
                <span style={{
                  background: ORANGE, color: '#fff',
                  borderRadius: '50%', width: 20, height: 20,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.68rem', fontWeight: 800,
                }}>
                  {totalItems}
                </span>
              )}
            </div>
          </Link>

          {/* 🔐 Admin — solo visible si no autenticado o es admin */}
          {(!isAuthenticated || user?.role === 'admin') && (
            <Link
              to={isAuthenticated && user?.role === 'admin' ? '/dashboard' : '/login'}
              title={isAuthenticated ? 'Panel Admin' : 'Administrador'}
              style={{ textDecoration: 'none' }}
            >
              <div style={{
                ...btnBase,
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 8,
                padding: '0.35rem 0.75rem',
                fontSize: '1.2rem',
              }}>
                🔐
              </div>
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}

function NavBtn({ to, label, title }) {
  return (
    <Link to={to} title={title} style={{ textDecoration: 'none' }}>
      <div style={btnBase}>{label}</div>
    </Link>
  )
}

const btnBase = {
  fontSize: '1.3rem',
  padding: '0.35rem 0.6rem',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'background 0.15s',
  color: '#fff',
}
