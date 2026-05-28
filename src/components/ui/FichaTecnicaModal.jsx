// src/components/ui/FichaTecnicaModal.jsx
// Modal de ficha técnica del producto — componente reutilizable

import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { PRODUCTOS_DATA } from '../../data/productosData'
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

const INGREDIENT_ICONS = [
  { keys: ['pollo','chicken'],                           emoji: '🐔', label: 'Pollo' },
  { keys: ['pescado','fish','salmón','salmon','trucha'], emoji: '🐟', label: 'Pescado' },
  { keys: ['arroz','rice'],                              emoji: '🌾', label: 'Arroz' },
  { keys: ['huevo','egg'],                               emoji: '🥚', label: 'Huevo' },
  { keys: ['cordero','lamb'],                            emoji: '🐑', label: 'Cordero' },
  { keys: ['pavo','turkey'],                             emoji: '🦃', label: 'Pavo' },
  { keys: ['res','carne','beef','bisonte','venado'],     emoji: '🥩', label: 'Carne' },
  { keys: ['avena','oat'],                               emoji: '🌿', label: 'Avena' },
  { keys: ['zanahoria','carrot'],                        emoji: '🥕', label: 'Zanahoria' },
  { keys: ['patata','papa','potato'],                    emoji: '🥔', label: 'Patata' },
  { keys: ['vitamina','vitamin','omega','dha'],          emoji: '💊', label: 'Vitaminas' },
]

function getIngredients(description) {
  if (!description) return []
  const d = description.toLowerCase()
  return INGREDIENT_ICONS.filter(i => i.keys.some(k => d.includes(k))).slice(0, 7)
}

function ProductImg({ product }) {
  const ph = CAT_PLACEHOLDER[product.categoryId] || CAT_PLACEHOLDER.default
  const [err, setErr] = useState(false)
  const src = product.image || `/productos/${product.id}.jpg`
  if (!err) return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 12 }}>
      <img src={src} alt={product.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={() => setErr(true)} />
    </div>
  )
  return (
    <div style={{ width: '100%', height: '100%', background: ph.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', borderRadius: 12 }}>
      {ph.emoji}
    </div>
  )
}

export default function FichaTecnicaModal({ product, onClose }) {
  const { addItem } = useCart()
  if (!product) return null

  const ph = CAT_PLACEHOLDER[product.categoryId] || CAT_PLACEHOLDER.default
  const ingredients = getIngredients(product.description)

  // Variantes del mismo producto (mismo nombre + marca)
  const variantes = PRODUCTOS_DATA.filter(p =>
    p.name === product.name && p.brand === product.brand
  )

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image ?? null })
    Swal.fire({
      toast: true, position: 'top-end', icon: 'success',
      title: `${product.name} agregado al carrito`,
      showConfirmButton: false, timer: 1500,
    })
    onClose()
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', animation: 'fadeIn .2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 20,
          width: '100%', maxWidth: 580,
          maxHeight: '92vh', overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
          animation: 'slideUp .22s ease',
        }}
      >
        {/* ── Cabecera ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '190px 1fr',
          background: ph.bg, borderRadius: '20px 20px 0 0',
          minHeight: 180, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ padding: '1.25rem' }}>
            <ProductImg product={product} />
          </div>

          <div style={{ padding: '1.5rem 1.5rem 1.5rem 0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '.8px' }}>
              {product.category}
            </span>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.2 }}>
              {product.name}
            </h2>
            {product.subtitle && (
              <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '.4px' }}>
                {product.subtitle}
              </p>
            )}
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#555', fontWeight: 600 }}>{product.brand}</p>
            {product.species && (
              <span className="badge badge-primary" style={{ alignSelf: 'flex-start', marginTop: 2 }}>
                {product.species === 'Perros' ? '🐶' : product.species === 'Gatos' ? '🐱' : '🐾'} {product.species}
              </span>
            )}
          </div>

          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            width: 30, height: 30, borderRadius: '50%',
            border: 'none', background: 'rgba(0,0,0,0.15)',
            cursor: 'pointer', fontSize: '1rem', color: '#333',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
          }}>✕</button>
        </div>

        {/* ── Cuerpo ── */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Ingredientes */}
          {ingredients.length > 0 && (
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '0.6rem' }}>
                Ingredientes principales
              </p>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {ingredients.map(ing => (
                  <div key={ing.label} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                    background: '#F8F9FA', borderRadius: 10, padding: '0.5rem 0.75rem', minWidth: 54,
                  }}>
                    <span style={{ fontSize: '1.4rem' }}>{ing.emoji}</span>
                    <span style={{ fontSize: '0.63rem', color: '#666', fontWeight: 600 }}>{ing.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabla de presentaciones */}
          {variantes.length > 1 && (
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '0.6rem' }}>
                Presentaciones disponibles
              </p>
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--color-primary)' }}>
                      {['Código','Presentación','Precio'].map(h => (
                        <th key={h} style={{ padding: '8px 14px', textAlign: h === 'Precio' ? 'right' : 'left', fontSize: '0.72rem', fontWeight: 700, color: '#fff' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {variantes.map((v, i) => (
                      <tr key={v.id} style={{ background: i % 2 === 0 ? '#fff' : '#F8FAFA' }}>
                        <td style={{ padding: '8px 14px', fontSize: '0.8rem', color: '#555' }}>{v.code}</td>
                        <td style={{ padding: '8px 14px', fontSize: '0.82rem', fontWeight: 600 }}>{v.presentation}</td>
                        <td style={{ padding: '8px 14px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary-dark)', textAlign: 'right' }}>
                          ${Number(v.price).toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Ficha técnica */}
          <div style={{ background: '#F8FAFA', borderRadius: 12, padding: '1rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '0.6rem' }}>
              📋 Ficha técnica
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                product.code         && ['Código',       product.code],
                product.presentation && ['Presentación', product.presentation],
                product.type         && ['Tipo',         product.type],
                product.target       && ['Dirigido a',   product.target],
                ['Stock',             `${product.stock} unidades`],
              ].filter(Boolean).map(([label, value]) => value && (
                <div key={label} style={{ display: 'flex', gap: '1rem', fontSize: '0.84rem' }}>
                  <span style={{ color: '#888', minWidth: 110, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#222' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '0.5rem' }}>
              📝 Descripción
            </p>
            <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.75, margin: 0 }}>
              {product.description}
            </p>
          </div>

          {/* Precio + botón */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            background: 'var(--color-primary-bg)', borderRadius: 12, padding: '1rem 1.25rem',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#888', fontWeight: 600 }}>Precio</p>
              <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary-dark)', lineHeight: 1 }}>
                ${Number(product.price).toLocaleString('es-CO')}
              </p>
            </div>
            <button
              className="btn btn-accent btn-lg"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={handleAdd}
              disabled={product.availability !== 'DISPONIBLE'}
            >
              🛒 Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
