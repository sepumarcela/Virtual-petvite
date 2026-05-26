// pages/OrdersPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../api/orderService'
import { formatDate } from '../helpers/formatters'
import { ORDER_STATUS } from '../helpers/constants'

const TEAL = '#3D8A8C'

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
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>📦 Pedidos recibidos</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Historial de todas las compras
      </p>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Aún no hay pedidos</h2>
          <Link to="/products" className="btn btn-primary">Ver productos</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{
              background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
            }}>
              {/* Cabecera del pedido */}
              <div
                style={{
                  padding: '1rem 1.25rem', display: 'flex', alignItems: 'center',
                  gap: '1rem', flexWrap: 'wrap', cursor: 'pointer',
                  borderBottom: expanded === order.id ? '1px solid var(--color-border)' : 'none',
                }}
                onClick={() => toggleExpand(order.id)}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, margin: 0 }}>Pedido #{order.id}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    {formatDate(order.createdAt)}
                  </p>
                  {/* Nombre del cliente en cabecera */}
                  {order.cliente && (
                    <p style={{ fontSize: '0.82rem', color: TEAL, fontWeight: 600, margin: '0.2rem 0 0' }}>
                      👤 {order.cliente.nombre} {order.cliente.apellido}
                    </p>
                  )}
                </div>
                <StatusBadge status={order.status} />
                <span style={{ fontWeight: 800, color: TEAL, fontSize: '1.05rem' }}>
                  ${order.total?.toLocaleString() ?? '—'}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                  {expanded === order.id ? '▲' : '▼'}
                </span>
              </div>

              {/* Detalle expandido */}
              {expanded === order.id && (
                <div style={{ padding: '1.25rem' }}>

                  {/* Datos del cliente */}
                  {order.cliente && (
                    <div style={{
                      background: '#f0f9f9', borderRadius: 10, padding: '1rem',
                      marginBottom: '1rem', border: `1px solid ${TEAL}22`,
                    }}>
                      <p style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', color: TEAL }}>
                        📋 Datos del comprador
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '0.5rem' }}>
                        <InfoRow icon="👤" label="Nombre"    value={`${order.cliente.nombre} ${order.cliente.apellido}`} />
                        <InfoRow icon="📞" label="Teléfono"  value={order.cliente.telefono} />
                        <InfoRow icon="📧" label="Correo"    value={order.cliente.email} />
                        <InfoRow icon="🏙️" label="Ciudad"   value={order.cliente.ciudad} />
                        <InfoRow icon="📍" label="Dirección" value={order.cliente.direccion} />
                        {order.cliente.notas && (
                          <InfoRow icon="📝" label="Notas"   value={order.cliente.notas} />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Productos del pedido */}
                  {order.items && (
                    <>
                      <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                        🛒 Productos en este pedido:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {order.items.map((item, idx) => (
                          <div key={idx} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            fontSize: '0.9rem', padding: '0.4rem 0',
                            borderBottom: '1px dashed var(--color-border)',
                          }}>
                            <span style={{ flex: 1 }}>{item.name}</span>
                            <span style={{ color: 'var(--color-text-muted)', marginRight: '1rem' }}>x{item.quantity}</span>
                            <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ textAlign: 'right', marginTop: '0.75rem', fontWeight: 800, color: TEAL, fontSize: '1rem' }}>
                        Total: ${order.total?.toLocaleString()}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div>
      <span style={{ fontSize: '0.75rem', color: '#888' }}>{icon} {label}</span>
      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem' }}>{value}</p>
    </div>
  )
}
