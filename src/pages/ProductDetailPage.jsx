// pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { productService } from '../api/productService'
import { useCart } from '../context/CartContext'
import Swal from 'sweetalert2'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getById(id)
        setProduct(data)
      } catch {
        Swal.fire({ title: 'Error', text: 'Producto no encontrado.', icon: 'error' })
          .then(() => navigate('/products'))
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id, navigate])

  const handleAddToCart = () => {
    addItem(product, quantity)
    Swal.fire({
      toast: true, position: 'top-end', icon: 'success',
      title: `${quantity}x ${product.name} agregado al carrito`,
      showConfirmButton: false, timer: 1800,
    })
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Cargando producto…</div>
  if (!product) return null

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <nav style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        <Link to="/">Inicio</Link> / <Link to="/products">Productos</Link> / {product.name}
      </nav>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem', background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '2rem',
      }}>
        <div style={{
          background: '#f0f4f0', borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '300px', fontSize: '6rem',
        }}>
          {product.image
            ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
            : '🐾'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
            {product.category || 'General'}
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2 }}>{product.name}</h1>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>{product.description}</p>

          {product.stock !== undefined && (
            <p style={{ fontSize: '0.875rem' }}>
              <span style={{
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: product.stock > 0 ? 'var(--color-success)' : 'var(--color-error)',
                marginRight: 6,
              }} />
              {product.stock > 0 ? `${product.stock} en stock` : 'Sin stock'}
            </p>
          )}

          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            ${product.price?.toLocaleString()}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600 }}>Cantidad:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '1.1rem' }}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span style={{ fontWeight: 700, minWidth: '2rem', textAlign: 'center' }}>{quantity}</span>
              <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '1.1rem' }}
                onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}
              onClick={handleAddToCart} disabled={product.stock === 0}>
              🛒 Agregar al carrito
            </button>
            <button className="btn btn-outline" style={{ padding: '0.75rem 1.25rem' }}
              onClick={() => navigate('/products')}>
              ← Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
