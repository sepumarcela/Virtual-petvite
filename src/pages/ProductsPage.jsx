// pages/ProductsPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productService } from '../api/productService'
import { useCart } from '../context/CartContext'
import Swal from 'sweetalert2'

export default function ProductsPage() {
  const [products, setProducts]       = useState([])
  const [categories, setCategories]   = useState([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, cats] = await Promise.all([
          productService.getAll(),
          productService.getCategories(),
        ])
        setProducts(prods)
        setCategories(cats)
      } catch {
        Swal.fire({ title: 'Error', text: 'No se pudieron cargar los productos.', icon: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat    = selectedCat ? p.categoryId === selectedCat : true
    return matchSearch && matchCat
  })

  const handleAddToCart = (product) => {
    addItem(product)
    Swal.fire({
      toast: true, position: 'top-end', icon: 'success',
      title: `${product.name} agregado al carrito`,
      showConfirmButton: false, timer: 1500,
    })
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Cargando productos…</div>

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>🛍️ Productos</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Encuentra todo lo que tu mascota necesita
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          type="text" className="form-control"
          placeholder="🔍 Buscar productos…"
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '320px' }}
        />
        <select
          className="form-control" value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          style={{ maxWidth: '220px' }}
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '3rem' }}>
          No se encontraron productos.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem',
        }}>
          {filtered.map((product) => (
            <div key={product.id} style={{
              background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              <div style={{ background: '#f0f4f0', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                {product.image
                  ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : '🐾'}
              </div>
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase' }}>
                  {product.category || 'General'}
                </span>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.3 }}>{product.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', flex: 1 }}>
                  {product.description?.slice(0, 60)}…
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    ${product.price?.toLocaleString()}
                  </span>
                  <Link to={`/products/${product.id}`} style={{ fontSize: '0.8rem' }}>Ver detalle</Link>
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
                  onClick={() => handleAddToCart(product)}
                >
                  🛒 Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
