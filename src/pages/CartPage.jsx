// pages/CartPage.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { cartToOrderPayload } from '../helpers/formatters'
import { orderService } from '../api/orderService'
import Swal from 'sweetalert2'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      const result = await Swal.fire({
        title: 'Inicia sesión',
        text: 'Debes estar autenticado para completar tu compra.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#2D6A4F',
      })
      if (result.isConfirmed) navigate('/login', { state: { from: { pathname: '/cart' } } })
      return
    }

    const result = await Swal.fire({
      title: '¿Confirmar pedido?',
      text: `Total: $${totalPrice.toLocaleString()} — ${totalItems} producto(s)`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2D6A4F',
    })

    if (result.isConfirmed) {
      try {
        await orderService.create(cartToOrderPayload(items))
        clearCart()
        await Swal.fire({
          title: '¡Pedido realizado! 🎉',
          text: 'Tu pedido fue confirmado. Puedes seguirlo en "Mis Pedidos".',
          icon: 'success',
          confirmButtonColor: '#2D6A4F',
        })
        navigate('/orders')
      } catch {
        Swal.fire({ title: 'Error', text: 'No se pudo procesar el pedido.', icon: 'error' })
      }
    }
  }

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

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>🛒 Mi Carrito</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        {totalItems} producto(s) en tu carrito
      </p>

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
              <p style={{ fontWeight: 600 }}>{item.name}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
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

            <p style={{ fontWeight: 700, color: 'var(--color-primary-dark)', minWidth: 80, textAlign: 'right' }}>
              ${(item.price * item.quantity).toLocaleString()}
            </p>

            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)', fontSize: '1.2rem' }}
              onClick={() => removeItem(item.id)} title="Eliminar">🗑️</button>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '2rem', background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)',
        padding: '1.5rem', maxWidth: 720,
      }}>
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
          <span style={{ color: 'var(--color-primary-dark)' }}>${totalPrice.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
            onClick={handleCheckout}>
            ✅ Confirmar pedido
          </button>
          <button className="btn btn-outline" style={{ padding: '0.75rem 1rem' }} onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>
      </div>
    </div>
  )
}
