// src/pages/FoodPage.jsx
import { useState, useMemo } from 'react'
import { PRODUCTOS_DATA } from '../data/productosData'
import ProductCard from '../components/ui/ProductCard'
import FichaTecnicaModal from '../components/ui/FichaTecnicaModal'

const MARCAS = [...new Set(
  PRODUCTOS_DATA.filter(p => p.categoryId === 'alimentos').map(p => p.brand).filter(Boolean)
)]

export default function FoodPage() {
  const [search,     setSearch]     = useState('')
  const [petFilter,  setPetFilter]  = useState('')
  const [marcaFilter,setMarcaFilter]= useState('')
  const [fichaOpen,  setFichaOpen]  = useState(null)

  const alimentos = useMemo(() =>
    PRODUCTOS_DATA.filter(p => p.categoryId === 'alimentos'),
  [])

  const species = [...new Set(alimentos.map(p => p.species).filter(Boolean))]

  const filtered = alimentos.filter(p => {
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchPet   = !petFilter  || p.species === petFilter
    const matchMarca = !marcaFilter || p.brand === marcaFilter
    return matchSearch && matchPet && matchMarca
  })

  const limpiar = () => { setSearch(''); setPetFilter(''); setMarcaFilter('') }

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      {/* Encabezado */}
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>🍖 Alimentos</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Comida premium y balanceada para tus mascotas
      </p>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
        {/* Búsqueda */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--color-surface)', border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)', padding: '0.55rem 0.875rem', flex: '1 1 250px',
        }}>
          <span>🔍</span>
          <input
            type="text" placeholder="Buscar alimentos…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: '0.92rem', width: '100%', fontFamily: 'inherit', background: 'transparent' }}
          />
        </div>

        {/* Filtro especie */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {['', ...species].map((sp, i) => (
            <button
              key={sp || 'all'}
              onClick={() => setPetFilter(sp)}
              style={{
                padding: '0.4rem 1rem', borderRadius: 999, fontWeight: 600,
                fontSize: '0.82rem', cursor: 'pointer',
                border: petFilter === sp ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
                background: petFilter === sp ? 'var(--color-primary)' : '#fff',
                color: petFilter === sp ? '#fff' : 'var(--color-text)',
                transition: 'all .15s ease',
              }}
            >
              {sp === '' ? 'Todos' : sp === 'Perros' ? '🐶 Perros' : '🐱 Gatos'}
            </button>
          ))}
        </div>

        {/* Filtro marca */}
        <select
          className="form-control"
          value={marcaFilter}
          onChange={e => setMarcaFilter(e.target.value)}
          style={{ maxWidth: 200, flex: '0 0 auto' }}
        >
          <option value="">Todas las marcas</option>
          {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {(search || petFilter || marcaFilter) && (
          <button className="btn btn-ghost btn-sm" onClick={limpiar}>✕ Limpiar</button>
        )}
      </div>

      {/* Marcas destacadas (acordeón) */}
      <MarcasAcordeon />

      {/* Contador */}
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
        <strong style={{ color: 'var(--color-primary)' }}>{filtered.length}</strong>{' '}
        producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--color-text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <p>No se encontraron alimentos con esa búsqueda.</p>
          <button className="btn btn-ghost" style={{ marginTop: '1rem' }} onClick={limpiar}>
            Ver todos los alimentos
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onVerFicha={setFichaOpen} />
          ))}
        </div>
      )}

      {fichaOpen && <FichaTecnicaModal product={fichaOpen} onClose={() => setFichaOpen(null)} />}
    </div>
  )
}

// ── Acordeón de marcas ────────────────────────────────────
const MARCAS_INFO = [
  { name: 'Nutra Nuggets',     emoji: '🏆', desc: 'Alimento concentrado premium con pollo, arroz y pescado. Ideal para todas las razas y etapas de vida.' },
  { name: 'Diamond Naturals',  emoji: '💎', desc: 'Nutrición holística con súper ingredientes. Proteínas de primera calidad, sin rellenos artificiales.' },
  { name: 'Taste of the Wild', emoji: '🌿', desc: 'Libre de granos con proteínas de animales salvajes como bisonte, venado y salmón ahumado.' },
  { name: 'Nutra Gold',        emoji: '⭐', desc: 'Alimento holístico con ingredientes naturales. Fórmulas especializadas para cada necesidad.' },
  { name: 'Country Value',     emoji: '🌾', desc: 'Excelente relación calidad-precio. Nutrición completa para perros y gatos de todas las razas.' },
]

function MarcasAcordeon() {
  const [open, setOpen] = useState(null)

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '0.6rem' }}>
        Nuestras marcas
      </p>
      <div className="accordion">
        {MARCAS_INFO.map((m, i) => (
          <div key={m.name} className="accordion-item">
            <button
              className={`accordion-trigger ${open === i ? 'open' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>{m.emoji} {m.name}</span>
              <span className={`accordion-chevron ${open === i ? 'open' : ''}`}>▼</span>
            </button>
            <div className={`accordion-content ${open === i ? 'open' : ''}`}>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                {m.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
