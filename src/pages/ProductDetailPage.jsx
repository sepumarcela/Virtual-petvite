// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { PRODUCTOS_DATA } from '../data/productosData'
import FichaTecnicaModal from '../components/ui/FichaTecnicaModal'
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

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product,    setProduct]    = useState(null)
  const [quantity,   setQuantity]   = useState(1)
  const [imgError,   setImgError]   = useState(false)
  const [fichaOpen,  setFichaOpen]  = useState(false)
  const [loading,    setLoading]    = useState(true)

  // Productos relacionados (misma categoría)
  const related = product
    ? PRODUCTOS_DATA.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)
    : []

  useEffect(() => {
    // Buscar en datos locales primero
    const local = PRODUCTOS_DATA.find(p => p.id === id || p.id === decodeURIComponent(id))
    if (local) {
      setProduct(local)
      setLoading(false)
      return
    }
    // Si no está local, intenta el backend
    import('../api/productService').then(({ productService }) => {
      productService.getById(id)
        .then(data => { setProduct(data); setLoading(false) })
        .catch(() => {
          Swal.fire({ title: 'Error', text: 'Producto no encontrado.', icon: 'error' })
            .then(() => navigate('/products'))
        })
    })
  }, [id, navigate])

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image ?? null }, quantity)
    Swal.fire({
      toast: true, position: 'top-end', icon: 'success',
      title: `${quantity}× ${product.name} agregado al carrito`,
      showConfirmButton: false, timer: 1800,
    })
  }

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
      Cargando producto…
    </div>
  )
  if (!product) return null

  const ph = CAT_PLACEHOLDER[product.categoryId] || CAT_PLACEHOLDER.default
  const imgSrc = product.image || `/productos/${product.id}.jpg`
  const disponible = product.availability === 'DISPONIBLE'

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Breadcrumb */}
      <nav style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/" style={{ color: 'var(--color-primary)' }}>Inicio</Link>
        <span>/</span>
        <Link to="/products" style={{ color: 'var(--color-primary)' }}>Productos</Link>
        <span>/</span>
        <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
      </nav>

      {/* Detalle principal */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem', background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '2rem',
        marginBottom: '2rem',
      }}>
        {/* Imagen */}
        <div style={{
          background: ph.bg, borderRadius: 'var(--radius-lg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 300, overflow: 'hidden',
        }}>
          {!imgError ? (
            <img
              src={imgSrc} alt={product.name}
              style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
              onError={() => setImgError(true)}
            />
          ) : (
            <span style={{ fontSize: '6rem' }}>{ph.emoji}</span>
          )}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>
              {product.brand} · {product.category}
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, lineHeight: 1.25, margin: '0.3rem 0 0' }}>
              {product.name}
            </h1>
          </div>

          {product.presentation && (
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              📦 {product.presentation}
            </span>
          )}

          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
            {product.description?.slice(0, 200)}{product.description?.length > 200 ? '…' : ''}
          </p>

          {/* Disponibilidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
              background: disponible ? 'var(--color-success)' : 'var(--color-error)',
            }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {disponible ? `Disponible · ${product.stock} en stock` : 'Sin stock'}
            </span>
          </div>

          {/* Precio */}
          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-primary-dark)', lineHeight: 1 }}>
            ${Number(product.price).toLocaleString('es-CO')}
          </div>

          {/* Cantidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>Cantidad:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn btn-outline btn-sm"
                style={{ padding: '0.3rem 0.8rem', fontSize: '1.1rem' }}
                onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span style={{ fontWeight: 800, minWidth: '2rem', textAlign: 'center', fontSize: '1.1rem' }}>{quantity}</span>
              <button className="btn btn-outline btn-sm"
                style={{ padding: '0.3rem 0.8rem', fontSize: '1.1rem' }}
                onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-accent"
              style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
              onClick={handleAddToCart}
              disabled={!disponible}
            >
              🛒 Agregar al carrito
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: '0.75rem 1.25rem' }}
              onClick={() => setFichaOpen(true)}
            >
              📋 Ver ficha completa
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate(-1)}
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {related.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
            También te puede interesar
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {related.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                style={{
                  background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)', overflow: 'hidden', cursor: 'pointer',
                  transition: 'transform .18s ease, box-shadow .18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                <div style={{
                  height: 110, background: (CAT_PLACEHOLDER[p.categoryId] || CAT_PLACEHOLDER.default).bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
                }}>
                  {(CAT_PLACEHOLDER[p.categoryId] || CAT_PLACEHOLDER.default).emoji}
                </div>
                <div style={{ padding: '0.75rem' }}>
                  <p style={{ fontSize: '0.68rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>{p.brand}</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0.2rem 0', lineHeight: 1.3 }}>{p.name}</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary-dark)', margin: 0 }}>
                    ${Number(p.price).toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal ficha técnica */}
      {fichaOpen && (
        <FichaTecnicaModal product={product} onClose={() => setFichaOpen(false)} />
      )}
    </div>
  )
}
