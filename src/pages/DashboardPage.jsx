// pages/DashboardPage.jsx
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

const StatCard = ({ icon, label, value, color }) => (
  <div style={{
    background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)', padding: '1.5rem',
    display: 'flex', alignItems: 'center', gap: '1rem',
    borderLeft: `4px solid ${color}`,
  }}>
    <div style={{ fontSize: '2.2rem' }}>{icon}</div>
    <div>
      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</p>
    </div>
  </div>
)

const QuickLink = ({ to, icon, label, description }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div style={{
      background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)', padding: '1.25rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
      transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
    >
      <div style={{ fontSize: '1.75rem' }}>{icon}</div>
      <div>
        <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{label}</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{description}</p>
      </div>
      <span style={{ marginLeft: 'auto', color: 'var(--color-primary)' }}>→</span>
    </div>
  </Link>
)

export default function DashboardPage() {
  const { user } = useAuth()
  const { totalItems, totalPrice } = useCart()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))',
        borderRadius: 'var(--radius-lg)', padding: '2rem', color: '#fff', marginBottom: '2rem',
      }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
          {greeting}, {user?.name || 'Usuario'} 🐾
        </h1>
        <p style={{ opacity: 0.85, marginTop: '0.25rem' }}>
          Bienvenido a tu panel de control de PetShop Virtual
        </p>
        <p style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem' }}>
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-muted)' }}>RESUMEN</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard icon="🛒" label="Ítems en carrito"   value={totalItems}                        color="var(--color-primary)" />
        <StatCard icon="💰" label="Total en carrito"   value={`$${totalPrice.toLocaleString()}`} color="var(--color-accent-dark)" />
        <StatCard icon="📦" label="Pedidos realizados" value="Ver"                                color="var(--color-primary-light)" />
        <StatCard icon="👤" label="Mi cuenta"          value={user?.email?.split('@')[0] || '—'} color="#6B7280" />
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>👤 Mi perfil</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {[['Nombre', user?.name], ['Correo', user?.email]].map(([label, val]) => (
            <div key={label} style={{ display: 'flex', gap: '1rem' }}>
              <span style={{ color: 'var(--color-text-muted)', minWidth: 100 }}>{label}:</span>
              <span style={{ fontWeight: 600 }}>{val || '—'}</span>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: 'var(--color-text-muted)', minWidth: 100 }}>Rol:</span>
            <span style={{
              display: 'inline-block', padding: '0.15rem 0.75rem',
              background: user?.role === 'admin' ? '#FEF3C7' : '#D1FAE5',
              color: user?.role === 'admin' ? '#92400E' : '#065F46',
              borderRadius: 999, fontSize: '0.8rem', fontWeight: 600,
            }}>
              {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
            </span>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-muted)' }}>ACCESOS RÁPIDOS</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <QuickLink to="/products"     icon="🛍️" label="Ver productos"    description="Explora nuestro catálogo" />
        <QuickLink to="/food"         icon="🍖" label="Alimentos"         description="Comida premium para mascotas" />
        <QuickLink to="/cart"         icon="🛒" label="Mi carrito"        description={`${totalItems} ítem(s) pendiente(s)`} />
        <QuickLink to="/orders"       icon="📦" label="Mis pedidos"       description="Historial de compras" />
        {user?.role === 'admin' && (
          <QuickLink to="/products/new" icon="➕" label="Agregar producto" description="Solo administradores" />
        )}
      </div>
    </div>
  )
}
