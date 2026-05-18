// pages/FoodPage.jsx
import { useState, useEffect } from 'react'
import { productService } from '../api/productService'
import { useCart } from '../context/CartContext'
import Swal from 'sweetalert2'

export default function FoodPage() {
  const [foods, setFoods]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    productService.getAllFood()
      .then(setFoods)
      .catch(() => Swal.fire({ title: 'Error', text: 'No se pudieron cargar los alimentos.', icon: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const filtered = foods.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleAdd = (food) => {
    addItem(food)
    Swal.fire({
      toast: true, position: 'top-end', icon: 'success',
      title: `${food.name} agregado al carrito`,
      showConfirmButton: false, timer: 1500,
    })
  }

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Cargando alimentos…</div>

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>🐶 Alimentos</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Comida premium y balanceada para tus mascotas
      </p>

      <input
        type="text" className="form-control"
        placeholder="🔍 Buscar alimentos…"
        value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 320, marginBottom: '2rem' }}
      />

      {filtered.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '3rem' }}>
          No se encontraron alimentos.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {filtered.map((food) => (
            <div key={food.id} style={{
              background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
                height: 140, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '3.5rem',
              }}>
                {food.image
                  ? <img src={food.image} alt={food.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : '🍖'}
              </div>

              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                {food.petType && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-dark)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Para {food.petType}
                  </span>
                )}
                <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>{food.name}</h3>
                {food.weight && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>⚖️ {food.weight}</p>
                )}
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', flex: 1 }}>
                  {food.description?.slice(0, 55)}…
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>
                    ${food.price?.toLocaleString()}
                  </span>
                </div>
                <button className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleAdd(food)}>
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
