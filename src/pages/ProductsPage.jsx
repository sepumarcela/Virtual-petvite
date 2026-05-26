// pages/ProductsPage.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { PRODUCTOS_DATA } from '../data/productosData'
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

const CATEGORIES = [
  { id: 'alimentos',  name: 'Alimentos' },
  { id: 'snacks',     name: 'Snacks' },
  { id: 'juguetes',   name: 'Juguetes' },
  { id: 'aseo',       name: 'Aseo y Cuidado' },
  { id: 'collares',   name: 'Collares y Traillas' },
  { id: 'comederos',  name: 'Comederos y Bebederos' },
  { id: 'transporte', name: 'Transporte' },
]

// Ingredientes por palabras clave en la descripción
const INGREDIENT_ICONS = [
  { keys: ['pollo', 'chicken'],    emoji: '🐔', label: 'Pollo' },
  { keys: ['pescado', 'fish', 'salmón', 'salmon', 'trucha'], emoji: '🐟', label: 'Pescado' },
  { keys: ['arroz', 'rice'],       emoji: '🌾', label: 'Arroz' },
  { keys: ['huevo', 'egg'],        emoji: '🥚', label: 'Huevo' },
  { keys: ['cordero', 'lamb'],     emoji: '🐑', label: 'Cordero' },
  { keys: ['pavo', 'turkey'],      emoji: '🦃', label: 'Pavo' },
  { keys: ['res', 'carne', 'beef', 'bisonte', 'venado'], emoji: '🥩', label: 'Carne' },
  { keys: ['avena', 'oat'],        emoji: '🌿', label: 'Avena' },
  { keys: ['zanahoria', 'carrot'], emoji: '🥕', label: 'Zanahoria' },
  { keys: ['patata', 'papa', 'potato'], emoji: '🥔', label: 'Patata' },
  { keys: ['vitamina', 'vitamin', 'omega'], emoji: '💊', label: 'Vitaminas' },
]

function getIngredients(description) {
  if (!description) return []
  const desc = description.toLowerCase()
  return INGREDIENT_ICONS.filter(ing =>
    ing.keys.some(k => desc.includes(k))
  ).slice(0, 7)
}

// Imagen del producto
function ProductImg({ product, height = 160, borderRadius = 0 }) {
  const ph = CAT_PLACEHOLDER[product.categoryId] || CAT_PLACEHOLDER.default
  const [imgError, setImgError] = useState(false)
  const imgSrc = `/productos/${product.id}.jpg`

  if (!imgError) {
    return (
      <div style={{ height, overflow: 'hidden', background: ph.bg, borderRadius, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={imgSrc}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius }}
          onError={() => setImgError(true)}
        />
      </div>
    )
  }
  return (
    <div style={{ height, background: ph.bg, borderRadius, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
      {ph.emoji}
    </div>
  )
}

// Tarjeta producto
function ProductCard({ product, onVerFicha, onAddToCart }) {
  return (
    <div style={{
      background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
    >
      <ProductImg product={product} height={160} />

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
          {product.brand}
        </span>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
          {product.name}
        </h3>
        {product.presentation && (
          <span style={{ fontSize: '0.75rem', color: '#888' }}>📦 {product.presentation}</span>
        )}
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', flex: 1, margin: 0, lineHeight: 1.4 }}>
          {product.description?.slice(0, 70)}{product.description?.length > 70 ? '…' : ''}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            ${Number(product.price).toLocaleString('es-CO')}
          </span>
          <span style={{
            fontSize: '0.7rem', padding: '2px 8px', borderRadius: 20, fontWeight: 700,
            background: product.availability === 'DISPONIBLE' ? '#E8F7F0' : '#FDF0F0',
            color: product.availability === 'DISPONIBLE' ? '#0F6E56' : '#C0392B',
          }}>
            {product.availability === 'DISPONIBLE' ? '✓ Disponible' : 'Agotado'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem', padding: '0.5rem' }}
            onClick={() => onAddToCart(product)}
            disabled={product.availability !== 'DISPONIBLE'}
          >
            🛒 Agregar
          </button>
          <button
            onClick={() => onVerFicha(product)}
            style={{
              padding: '0.5rem 0.75rem', borderRadius: 8,
              border: '1.5px solid #2A8B8B',
              background: 'transparent', color: '#2A8B8B',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Ver ficha
          </button>
        </div>
      </div>
    </div>
  )
}

// Modal ficha técnica profesional
function FichaTecnicaModal({ product, onClose }) {
  const { addItem } = useCart()
  if (!product) return null

  const ph = CAT_PLACEHOLDER[product.categoryId] || CAT_PLACEHOLDER.default
  const ingredients = getIngredients(product.description)

  // Agrupar presentaciones del mismo producto (mismo nombre y marca)
  const variantes = PRODUCTOS_DATA.filter(p =>
    p.name === product.name && p.brand === product.brand
  )

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: null })
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
        padding: '1rem', animation: 'fadeInBg .2s ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 20,
          width: '100%', maxWidth: 600,
          maxHeight: '92vh', overflowY: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.28)',
          animation: 'slideUp .22s ease',
        }}
      >
        {/* ── CABECERA con imagen ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '200px 1fr',
          borderRadius: '20px 20px 0 0', overflow: 'hidden',
          background: ph.bg, minHeight: 200,
          position: 'relative',
        }}>
          {/* Imagen */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <ProductImg product={product} height={170} borderRadius={12} />
          </div>

          {/* Info principal */}
          <div style={{ padding: '1.5rem 1.5rem 1.5rem 0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#2A8B8B', textTransform: 'uppercase', letterSpacing: '.8px' }}>
              {product.category}
            </span>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#1a1a1a', lineHeight: 1.2 }}>
              {product.name}
            </h2>
            {product.subtitle && (
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#E8A020', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                {product.subtitle}
              </p>
            )}
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#555', fontWeight: 600 }}>
              {product.brand}
            </p>
            {product.species && (
              <span style={{
                display: 'inline-block', padding: '3px 12px', borderRadius: 20,
                background: 'rgba(42,139,139,0.15)', color: '#1E6666',
                fontSize: '0.75rem', fontWeight: 700, alignSelf: 'flex-start',
              }}>
                {product.species === 'Perros' ? '🐶' : product.species === 'Gatos' ? '🐱' : '🐾'} {product.species}
              </span>
            )}
          </div>

          {/* Botón cerrar */}
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 12,
            width: 32, height: 32, borderRadius: '50%',
            border: 'none', background: 'rgba(0,0,0,0.15)',
            cursor: 'pointer', fontSize: '1rem', color: '#333',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700,
          }}>✕</button>
        </div>

        {/* ── CUERPO ── */}
        <div style={{ padding: '1.5rem' }}>

          {/* Ingredientes / emojis */}
          {ingredients.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '0.6rem' }}>
                Ingredientes principales
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {ingredients.map(ing => (
                  <div key={ing.label} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
                    background: '#F8F9FA', borderRadius: 10, padding: '0.5rem 0.75rem',
                    minWidth: 56,
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{ing.emoji}</span>
                    <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 600 }}>{ing.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabla de presentaciones */}
          {variantes.length > 1 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '0.6rem' }}>
                Presentaciones disponibles
              </p>
              <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #E8E8E8' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#2A8B8B' }}>
                      <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Código</th>
                      <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Presentación</th>
                      <th style={{ padding: '8px 14px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantes.map((v, i) => (
                      <tr key={v.id} style={{ background: i % 2 === 0 ? '#fff' : '#F8F9FA' }}>
                        <td style={{ padding: '8px 14px', fontSize: '0.82rem', color: '#555' }}>{v.code}</td>
                        <td style={{ padding: '8px 14px', fontSize: '0.82rem', fontWeight: 600 }}>{v.presentation}</td>
                        <td style={{ padding: '8px 14px', fontSize: '0.85rem', fontWeight: 800, color: '#1E6666', textAlign: 'right' }}>
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
          <div style={{ background: '#F8F9FA', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '0.6rem' }}>
              📋 Ficha técnica
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {[
                product.code         && ['Código',        product.code],
                product.presentation && ['Presentación',  product.presentation],
                product.type         && ['Tipo',          product.type],
                product.target       && ['Dirigido a',    product.target],
                ['Stock',             `${product.stock} unidades`],
              ].filter(Boolean).map(([label, value]) => (
                <div key={label} style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#888', minWidth: 110, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontWeight: 600, color: '#222' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Descripción */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '0.5rem' }}>
              📝 Descripción
            </p>
            <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.75, margin: 0 }}>
              {product.description}
            </p>
          </div>

          {/* Precio + botón */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            background: '#F0F9F9', borderRadius: 12, padding: '1rem 1.25rem',
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>Precio</p>
              <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#1E6666', lineHeight: 1 }}>
                ${Number(product.price).toLocaleString('es-CO')}
              </p>
            </div>
            <button
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
              onClick={handleAdd}
              disabled={product.availability !== 'DISPONIBLE'}
            >
              🛒 Agregar al carrito
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInBg { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp  { from { transform:translateY(24px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      `}</style>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────
export default function ProductsPage() {
  const [search,       setSearch]      = useState('')
  const [selectedCat,  setSelectedCat] = useState('')
  const [fichaOpen,    setFichaOpen]   = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()

  useEffect(() => {
    const catFromUrl = searchParams.get('cat')
    if (catFromUrl) setSelectedCat(catFromUrl)
  }, [])

  const handleCatChange = (value) => {
    setSelectedCat(value)
    if (value) setSearchParams({ cat: value })
    else setSearchParams({})
  }

  const filtered = PRODUCTOS_DATA.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = !selectedCat || p.categoryId === selectedCat
    return matchSearch && matchCat
  })

  const handleAddToCart = (product) => {
    addItem({ id: product.id, name: product.name, price: product.price, image: null })
    Swal.fire({
      toast: true, position: 'top-end', icon: 'success',
      title: `${product.name} agregado al carrito`,
      showConfirmButton: false, timer: 1500,
    })
  }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>🛍️ Productos</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Encuentra todo lo que tu mascota necesita
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <input
          type="text" className="form-control"
          placeholder="🔍 Buscar por nombre, marca o descripción…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <select
          className="form-control" value={selectedCat}
          onChange={e => handleCatChange(e.target.value)}
          style={{ maxWidth: 220 }}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        {(search || selectedCat) && (
          <button className="btn btn-outline" onClick={() => { setSearch(''); handleCatChange('') }}
            style={{ fontSize: '0.85rem' }}>
            ✕ Limpiar
          </button>
        )}
      </div>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>No se encontraron productos.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onVerFicha={setFichaOpen}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {fichaOpen && (
        <FichaTecnicaModal product={fichaOpen} onClose={() => setFichaOpen(null)} />
      )}
    </div>
  )
}
