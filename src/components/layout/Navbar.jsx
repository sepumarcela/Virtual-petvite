import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

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
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 999,
    }}>

      {/* TOP BAR */}
      <div style={{
        background: DARK_TEAL,
        color: '#fff',
        fontSize: '0.78rem',
        padding: '0.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <span>📞 310 385 2168</span>
          <span>🛡️ Compras seguras online</span>
          <span>💳 Pago contra entrega</span>
          <span>🚚 Entregas el mismo día</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <span style={{ opacity: 0.85 }}>
            Síguenos en redes
          </span>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FacebookIcon />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <InstagramIcon />
          </a>
        </div>
      </div>

      {/* NAVBAR */}
    <nav style={{
  background: 'rgba(255,255,255,0.96)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
}}>

  <div style={{
    maxWidth: '1450px',
    margin: '0 auto',
    padding: '1rem 2rem',
    display: 'grid',
    gridTemplateColumns: '260px 1fr auto',
    alignItems: 'center',
    gap: '2rem',
  }}>

    {/* LOGO */}
    <Link
      to="/"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        textDecoration: 'none',
      }}
    >
      <img
        src="/logo.png"
        alt="VirtualPet"
        style={{
          width: 82,
          height: 82,
          objectFit: 'contain',
        }}
      />

      <div>
        <div style={{
          fontSize: '2rem',
          fontWeight: 900,
          color: DARK_TEAL,
          lineHeight: 1,
        }}>
          VirtualPet
        </div>

        <div style={{
          fontSize: '0.82rem',
          color: '#6B7280',
          marginTop: '0.3rem',
          fontWeight: 600,
        }}>
          Todo para tu mascota 🐾
        </div>
      </div>
    </Link>

    {/* BUSCADOR */}
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '700px',
        background: '#F3F4F6',
        borderRadius: '16px',
        padding: '0.9rem 1.2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        border: '1px solid rgba(0,0,0,0.05)',
      }}>
        <span style={{
          fontSize: '1.2rem',
          opacity: 0.7,
        }}>
          🔍
        </span>

        <input
          type="text"
          placeholder="Buscar productos para tu mascota..."
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            width: '100%',
            fontSize: '0.95rem',
            color: '#1A1A1A',
          }}
        />
      </div>
    </div>

    {/* BOTONES */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.7rem',
    }}>

      <NavBtn to="/" label="🏠" title="Inicio" />

      <NavBtn to="/products" label="🛍️" title="Productos" />

      {/* CARRITO */}
      <Link
        to="/cart"
        title="Carrito"
        style={{ textDecoration: 'none' }}
      >
        <div style={{
          ...btnBase,
          position: 'relative',
        }}>
          🛒

          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: -5,
              right: -5,
              background: ORANGE,
              color: '#fff',
              width: 20,
              height: 20,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 800,
            }}>
              {totalItems}
            </span>
          )}
        </div>
      </Link>

      {/* ADMIN — siempre visible, siempre va a /admin/login */}
      <Link
        to="/admin/login"
        title="Panel Administrativo"
        style={{ textDecoration: 'none' }}
      >
        <div style={{
          ...btnBase,
          background: ORANGE,
          color: '#fff',
        }}>
          🔐
        </div>
      </Link>
    </div>
  </div>
</nav>
     
    </header>
  )
}

function NavBtn({ to, label, title }) {
  return (
    <Link
      to={to}
      title={title}
      style={{ textDecoration: 'none' }}
    >
      <div style={btnBase}>
        {label}
      </div>
    </Link>
  )
}

const btnBase = {
  width: 50,
  height: 50,
  borderRadius: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#F3F4F6',
  color: DARK_TEAL,
  fontSize: '1.25rem',
  border: '1px solid rgba(0,0,0,0.05)',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
}