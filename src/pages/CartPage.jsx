// pages/CartPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { orderService } from '../api/orderService'
import Swal from 'sweetalert2'

const TEAL   = '#3D8A8C'
const ORANGE = '#D4883B'
const LIGHT_TEAL = '#EBF5F5'

const INITIAL_FORM = {
  nombre: '', apellido: '', telefono: '', email: '',
  ciudad: '', direccion: '', notas: '',
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(INITIAL_FORM)
  const [errors, setErrors]       = useState({})
  const [loading, setLoading]     = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = 'Campo requerido'
    if (!form.apellido.trim())  e.apellido  = 'Campo requerido'
    if (!form.telefono.trim())  e.telefono  = 'Campo requerido'
    if (!form.email.trim())     e.email     = 'Campo requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Correo inválido'
    if (!form.ciudad.trim())    e.ciudad    = 'Campo requerido'
    if (!form.direccion.trim()) e.direccion = 'Campo requerido'
    return e
  }

  const handleConfirm = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const payload = {
        items: items.map(({ id, name, price, quantity }) => ({ productId: id, name, price, quantity })),
        total: totalPrice,
        createdAt: new Date().toISOString(),
        status: 'pending',
        cliente: { ...form },
      }
      await orderService.create(payload)
      clearCart()
      setShowModal(false)
      await Swal.fire({
        title: '¡Pedido realizado! 🎉',
        html: `
          <p style="margin:0 0 0.5rem">Gracias, <b>${form.nombre} ${form.apellido}</b>.</p>
          <p style="margin:0 0 0.5rem; color:#555; font-size:0.9rem">Te contactaremos al ${form.telefono} para coordinar la entrega en:</p>
          <p style="font-weight:600; color:#1E5F61">${form.direccion}, ${form.ciudad}</p>
        `,
        icon: 'success',
        confirmButtonColor: TEAL,
      })
      navigate('/')
    } catch {
      Swal.fire({ title: 'Error', text: 'No se pudo procesar el pedido.', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // ── Carrito vacío ──────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ marginBottom: '0.5rem' }}>Tu carrito está vacío</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Agrega productos para comenzar tu compra
        </p>
        <Link to="/products" className="btn btn-primary">Ver productos</Link>
      </div>
    )
  }

  // ── Carrito con productos ──────────────────────────────────────
  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>🛒 Mi Carrito</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        {totalItems} producto(s) en tu carrito
      </p>

      {/* Lista de productos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 720 }}>
        {items.map((item) => (
          <div key={item.id} style={{
            background: 'var(--color-surface)', borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-sm)', padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 'var(--radius-sm)',
              background: '#f0f4f0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '2rem', flexShrink: 0,
            }}>
              {item.image
                ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                : '🐾'}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, margin: 0 }}>{item.name}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                ${item.price?.toLocaleString()} c/u
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.2rem 0.6rem' }}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
              <span style={{ fontWeight: 700, minWidth: '1.5rem', textAlign: 'center' }}>{item.quantity}</span>
              <button className="btn btn-outline" style={{ padding: '0.2rem 0.6rem' }}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <p style={{ fontWeight: 700, color: TEAL, minWidth: 80, textAlign: 'right', margin: 0 }}>
              ${(item.price * item.quantity).toLocaleString()}
            </p>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', fontSize: '1.2rem' }}
              onClick={() => removeItem(item.id)} title="Eliminar">🗑️</button>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div style={{ marginTop: '2rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '1.5rem', maxWidth: 720 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Subtotal</span>
          <span>${totalPrice.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Envío</span>
          <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Gratis</span>
        </div>
        <hr style={{ borderColor: 'var(--color-border)', marginBottom: '1rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          <span>Total</span>
          <span style={{ color: TEAL }}>${totalPrice.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            style={{ flex: 1, padding: '0.75rem', background: ORANGE, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 12px rgba(212,136,59,0.35)' }}
            onClick={() => setShowModal(true)}>
            ✅ Confirmar pedido
          </button>
          <button
            style={{ padding: '0.75rem 1rem', background: 'transparent', color: TEAL, border: `2px solid ${TEAL}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
            onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>
      </div>

      {/* ── MODAL DE DATOS DEL CLIENTE ───────────────────────── */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}>
          <div style={{
            background: '#fff', borderRadius: 16,
            width: '100%', maxWidth: 560,
            maxHeight: '90vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}>
            {/* Cabecera modal */}
            <div style={{ background: TEAL, padding: '1.25rem 1.5rem', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ color: '#fff', margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>📋 Datos de entrega</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.82rem' }}>
                  Completa tus datos para procesar el pedido
                </p>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            {/* Cuerpo modal */}
            <div style={{ padding: '1.5rem' }}>

              {/* Resumen rápido */}
              <div style={{ background: LIGHT_TEAL, borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#555', fontSize: '0.88rem' }}>🛒 {totalItems} producto(s)</span>
                <span style={{ fontWeight: 800, color: TEAL, fontSize: '1.1rem' }}>${totalPrice.toLocaleString()}</span>
              </div>

              {/* Formulario */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>

                <Field label="Nombre *"    name="nombre"    value={form.nombre}    error={errors.nombre}    onChange={handleChange} placeholder="Juan" />
                <Field label="Apellido *"  name="apellido"  value={form.apellido}  error={errors.apellido}  onChange={handleChange} placeholder="Pérez" />
                <Field label="Teléfono *"  name="telefono"  value={form.telefono}  error={errors.telefono}  onChange={handleChange} placeholder="300 123 4567" type="tel" />
                <Field label="Correo *"    name="email"     value={form.email}     error={errors.email}     onChange={handleChange} placeholder="tu@correo.com" type="email" />
                <Field label="Ciudad *"    name="ciudad"    value={form.ciudad}    error={errors.ciudad}    onChange={handleChange} placeholder="Bogotá" />
                <Field label="Dirección *" name="direccion" value={form.direccion} error={errors.direccion} onChange={handleChange} placeholder="Calle 123 # 45-67" />

                {/* Notas - columna completa */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Notas adicionales</label>
                  <textarea
                    name="notas" value={form.notas} onChange={handleChange}
                    placeholder="Indicaciones de entrega, apartamento, etc."
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  style={{
                    flex: 1, padding: '0.8rem', background: ORANGE,
                    color: '#fff', border: 'none', borderRadius: 8,
                    fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                    fontSize: '1rem', boxShadow: '0 4px 12px rgba(212,136,59,0.35)',
                    opacity: loading ? 0.7 : 1,
                  }}>
                  {loading ? 'Procesando…' : '✅ Confirmar pedido'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.8rem 1.2rem', background: 'transparent', color: '#666', border: '2px solid #ddd', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Componente Field ───────────────────────────────────────
function Field({ label, name, value, error, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} name={name} value={value}
        onChange={onChange} placeholder={placeholder}
        style={{ ...inputStyle, borderColor: error ? '#e53e3e' : '#ddd' }}
      />
      {error && <span style={{ color: '#e53e3e', fontSize: '0.73rem' }}>{error}</span>}
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '0.82rem',
  fontWeight: 600, color: '#374151', marginBottom: '0.3rem',
}

const inputStyle = {
  width: '100%', padding: '0.55rem 0.75rem',
  border: '1.5px solid #ddd', borderRadius: 8,
  fontSize: '0.9rem', outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}
