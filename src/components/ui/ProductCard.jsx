// src/components/ui/ProductCard.jsx
// Tarjeta de producto reutilizable — usada en ProductsPage y FoodPage

import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import Swal from 'sweetalert2'

const CAT_PLACEHOLDER = {
  alimentos:  { emoji: '🍖', bg: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)' },
  snacks:     { emoji: '🦴', bg: 'linear-gradient(135deg, #FFF8E1, #FFECB3)' },
  juguetes:   { emoji: '🧸', bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)' },
  aseo:       { emoji: '🛁', bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)' },
  collares:   { emoji: '🐕', bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)' },
  comederos:  { emoji: '🥣', bg: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)' },
  transporte: { emoji: '🧳', bg: 'linear-gradient(135deg, #FBE9E7, #FFCCBC)' },
  default:    { emoji: '🐾', bg: 'linear-gradient(135deg, #F0F4F0, #E0E8E0)' },
}

function ProductImg({ product, height = 160 }) {
  const ph = CAT_PLACEHOLDER[product.categoryId] || CAT_PLACEHOLDER.default
  const [err, setErr] = useState(false)
  const src = `/productos/${product.id}.jpg`

  if (!err) {
    return (
      <div style={{ height, overflow: 'hidden', background: ph.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={src}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={() => setErr(true)}
        />
      </div>
    )
  }
  return (
    <div style={{ height, background: ph.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
      {ph.emoji}
    </div>
  )
}

export default function ProductCard({ product, onVerFicha }) {
  const { addItem } = useCart()

  const handleAdd = (e) => {
    e.stopPropagation()
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image ?? null })
    Swal.fire({
      toast: true, position: 'top-end', icon: 'success',
      title: `${product.name} agregado al carrito`,
      showConfirmButton: false, timer: 1500,
    })
  }

  return (
    <div
      className="card card-hover"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onClick={() => onVerFicha?.(product)}
    >
      <ProductImg product={product} height={160} />

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {/* Marca */}
        <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.4px' }}>
          {product.brand}
        </span>

        {/* Nombre */}
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.35, margin: 0, color: 'var(--color-text)' }}>
          {product.name}
        </h3>

        {/* Presentación */}
        {product.presentation && (
          <span style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)' }}>
            📦 {product.presentation}
          </span>
        )}

        {/* Descripción */}
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', flex: 1, margin: 0, lineHeight: 1.4 }}>
          {product.description?.slice(0, 72)}{product.description?.length > 72 ? '…' : ''}
        </p>

        {/* Precio + disponibilidad */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            ${Number(product.price).toLocaleString('es-CO')}
          </span>
          <span className={`badge ${product.availability === 'DISPONIBLE' ? 'badge-success' : 'badge-error'}`}>
            {product.availability === 'DISPONIBLE' ? '✓ Disponible' : 'Agotado'}
          </span>
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={handleAdd}
            disabled={product.availability !== 'DISPONIBLE'}
          >
            🛒 Agregar
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={(e) => { e.stopPropagation(); onVerFicha?.(product) }}
          >
            Ver ficha
          </button>
        </div>
      </div>
    </div>
  )
}
