// pages/OrdersPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../api/orderService'
import { formatDate } from '../helpers/formatters'
import { ORDER_STATUS } from '../helpers/constants'

const StatusBadge = ({ status }) => {
  const s = ORDER_STATUS[status] || ORDER_STATUS.pending
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.75rem',
      background: s.bg, color: s.color,
      borderRadius: 999, fontSize: '0.78rem', fontWeight: 700,
    }}>
      {s.label}
    </span>
  )
}

export default function OrdersPage() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    orderService.getAll()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id))

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Cargando pedidos…</div>

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>📦 Mis Pedidos</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Historial de todas tus compras
      </p>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Aún no tienes pedidos</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            ¡Explora nuestros productos y haz tu primera compra!
          </p>
          <Link to="/products" className="btn btn-primary">Ver productos</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
              <div
                style={{
                  padding: '1rem 1.25rem', display: 'flex', alignItems: 'center',
                  gap: '1rem', flexWrap: 'wrap', cursor: 'pointer',
                  borderBottom: expanded === order.id ? '1px solid var(--color-border)' : 'none',
                }}
                onClick={() => toggleExpand(order.id)}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700 }}>Pedido #{order.id}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <StatusBadge status={order.status} />
                <span style={{ fontWeight: 800, color: 'var(--color-primary-dark)', fontSize: '1.05rem' }}>
                  ${order.total?.toLocaleString() ?? '—'}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                  {expanded === order.id ? '▲' : '▼'}
                </span>
              </div>

              {expanded === order.id && order.items && (
                <div style={{ padding: '1rem 1.25rem' }}>
                  <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                    Productos en este pedido:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        fontSize: '0.9rem', padding: '0.4rem 0',
                        borderBottom: '1px dashed var(--color-border)',
                      }}>
                        <span>{item.name}</span>
                        <span style={{ color: 'var(--color-text-muted)' }}>x{item.quantity}</span>
                        <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
