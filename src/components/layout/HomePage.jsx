// pages/HomePage.jsx
import { Link } from "react-router-dom";

const CATEGORIES = [
  { emoji: '🍖', name: 'Alimentos',             description: 'Comida premium para tus mascotas',      to: '/food' },
  { emoji: '🦴', name: 'Snacks',                description: 'Premios y golosinas naturales',          to: '/products?cat=snacks' },
  { emoji: '🧸', name: 'Juguetes',              description: 'Diversión garantizada',                  to: '/products?cat=juguetes' },
  { emoji: '🛁', name: 'Aseo y Cuidado',        description: 'Higiene y bienestar para tu mascota',    to: '/products?cat=aseo' },
  { emoji: '🐕', name: 'Collares y Traillas',   description: 'Accesorios para paseos seguros',         to: '/products?cat=collares' },
  { emoji: '🥣', name: 'Comederos y Bebederos', description: 'Alimentación e hidratación a la mano',   to: '/products?cat=comederos' },
  { emoji: '🧳', name: 'Transporte',            description: 'Viaja seguro con tu mascota',            to: '/products?cat=transporte' },
]

const CAT_COLORS = [
  'linear-gradient(135deg, #FFF3E0, #FFE0B2)',
  'linear-gradient(135deg, #FFF8E1, #FFECB3)',
  'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
  'linear-gradient(135deg, #E3F2FD, #BBDEFB)',
  'linear-gradient(135deg, #F3E5F5, #E1BEE7)',
  'linear-gradient(135deg, #E0F7FA, #B2EBF2)',
  'linear-gradient(135deg, #FBE9E7, #FFCCBC)',
]

export default function HomePage() {
  const row1 = CATEGORIES.slice(0, 3)
  const row2 = CATEGORIES.slice(3, 5)
  const row3 = CATEGORIES.slice(5, 7)

  const CardRow = ({ items, justify = 'center' }) => (
    <div style={{
      display: 'flex',
      justifyContent: justify,
      gap: '1.5rem',
      flexWrap: 'wrap',
      marginBottom: '1.5rem',
    }}>
      {items.map((cat, i) => (
        <Link
          key={cat.name}
          to={cat.to}
          style={{ textDecoration: 'none', color: 'inherit', flex: '0 0 220px', maxWidth: 220 }}
        >
          <div style={{
            background: CAT_COLORS[CATEGORIES.indexOf(cat)],
            borderRadius: '1rem',
            padding: '1.75rem 1.25rem',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            height: '100%',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)'
              e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.13)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)'
            }}
          >
            <div style={{ fontSize: '2.75rem', marginBottom: '0.75rem' }}>{cat.emoji}</div>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 0.4rem', color: '#1a1a1a' }}>{cat.name}</h3>
            <p style={{ fontSize: '0.82rem', color: '#555', margin: 0, lineHeight: 1.4 }}>{cat.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )

  return (
    <div>
      {/* Hero */}
      <section className="home-hero">
        <h1>Virtual Pet 🐾</h1>
        <p>Todo lo que tu mascota necesita en un solo lugar</p>
        <Link to="/products">
          <button className="btn btn-accent">Ver productos</button>
        </Link>
      </section>

      {/* Categorías */}
      <section className="home-section" style={{ maxWidth: 800, margin: '0 auto', padding: '2.5rem 1rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.6rem', fontWeight: 700 }}>Categorías</h2>

        
        <CardRow items={row1} />

        
        <CardRow items={row2} />

        
        <CardRow items={row3} />
      </section>
    </div>
  )
}
