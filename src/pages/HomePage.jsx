// pages/HomePage.jsx
import { Link } from "react-router-dom";

const TEAL       = '#3D8A8C'
const ORANGE     = '#D4883B'
const DARK_TEAL  = '#1E5F61'
const DARK_FOOTER= '#0E3130'
const LIGHT_ORANGE = '#FFF0DC'
const LIGHT_TEAL   = '#EBF5F5'

const CATEGORIES = [
  { emoji: '🐾', name: 'Alimento concentrado', to: '/food' },
  { emoji: '🦴', name: 'Snacks',               to: '/products?cat=snacks' },
  { emoji: '🥣', name: 'Comederos y bebederos',to: '/products?cat=comederos' },
  { emoji: '🛁', name: 'Aseo y cuidado',       to: '/products?cat=aseo' },
  { emoji: '🧳', name: 'Transporte',           to: '/products?cat=transporte' },
  { emoji: '🐕', name: 'Collares y traillas',  to: '/products?cat=collares' },
  { emoji: '🧸', name: 'Juguetes',             to: '/products?cat=juguetes' },
]

const BENEFITS = [
  { icon: '🚚', title: 'Entrega mismo día',       desc: 'Bogotá y principales ciudades' },
  { icon: '🛡️', title: 'Compra segura',           desc: 'Pago contra entrega disponible' },
  { icon: '🎧', title: 'Soporte experto',          desc: 'Asesoría veterinaria en línea' },
]

const FOOTER_CATS = [
  'Alimento concentrado','Snacks y premios','Comederos y bebederos',
  'Aseo y cuidado','Transporte','Juguetes'
]

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", color: '#1a1a1a', background: '#fff' }}>


      <section style={{
        background: `linear-gradient(135deg, ${DARK_TEAL} 0%, ${TEAL} 60%, #52A0A2 100%)`,
        padding: '3rem 2rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 350, height: 350, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 280 }}>
            <span style={{
              display: 'inline-block', background: ORANGE, color: '#fff',
              borderRadius: 999, padding: '0.3rem 1rem',
              fontSize: '0.78rem', fontWeight: 700, marginBottom: '1.25rem', letterSpacing: 1,
            }}>
              ¡Nuevo catálogo disponible — Edición 7!
            </span>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.25, margin: '0 0 0.75rem' }}>
              Todo lo que tu mascota<br />necesita, en un solo lugar
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', margin: '0 0 1.75rem', lineHeight: 1.6 }}>
              Alimentos premium · Snacks · Accesorios 
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products">
                <button style={{
                  background: ORANGE, color: '#fff', border: 'none',
                  borderRadius: 8, padding: '0.7rem 1.6rem',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(212,136,59,0.45)',
                }}>
                  Ver catálogo completo
                </button>
              </Link>
              <Link to="/food">
                <button style={{
                  background: 'transparent', color: '#fff',
                  border: '2px solid rgba(255,255,255,0.6)',
                  borderRadius: 8, padding: '0.7rem 1.6rem',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                }}>
                  Ver alimentos
                </button>
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem', flexShrink: 0 }}>
            {[['133+','Productos'],['10','Categorías'],['15+','Marcas']].map(([n,l]) => (
              <div key={l} style={{ textAlign: 'center', color: '#fff' }}>
                <p style={{ fontSize: '2.2rem', fontWeight: 900, color: ORANGE, margin: 0 }}>{n}</p>
                <p style={{ fontSize: '0.75rem', opacity: 0.75, margin: '0.2rem 0 0' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CHIPS DE CATEGORÍAS ────────────────────────── */}
      <section style={{
        borderBottom: '1px solid #e5e7eb',
        padding: '0.85rem 2rem',
        display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center',
      }}>
        {CATEGORIES.map((c, i) => (
          <Link key={c.name} to={c.to} style={{ textDecoration: 'none' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.35rem 0.85rem', borderRadius: 999,
              border: i === 0 ? `2px solid ${TEAL}` : '1px solid #e2e8f0',
              background: i === 0 ? LIGHT_TEAL : '#fff',
              color: i === 0 ? TEAL : '#374151',
              fontWeight: i === 0 ? 700 : 500,
              fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {c.emoji} {c.name}
            </span>
          </Link>
        ))}
      </section>

      {/* ─── BANNERS PERRO / GATO ───────────────────────── */}
      <section style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem' }}>
        <div style={{ background: LIGHT_ORANGE, borderRadius: 16, padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 0.4rem', fontWeight: 800 }}>Cuida a tu mejor amigo 🐶</h3>
            <p style={{ color: '#555', fontSize: '0.85rem', margin: '0 0 1rem', lineHeight: 1.5 }}>
              Todo en alimentos premium,<br />snacks y accesorios para perros
            </p>
            <Link to="/food">
              <button style={{ background: ORANGE, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
                Ver productos
              </button>
            </Link>
          </div>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>🐕</div>
        </div>

        <div style={{ background: LIGHT_TEAL, borderRadius: 16, padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: '0 0 0.4rem', fontWeight: 800 }}>Mima a tu felino 🐱</h3>
            <p style={{ color: '#555', fontSize: '0.85rem', margin: '0 0 1rem', lineHeight: 1.5 }}>
              Productos hechos para<br />su comodidad y diversión
            </p>
            <Link to="/products">
              <button style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem 1.2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.88rem' }}>
                Ver productos
              </button>
            </Link>
          </div>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: TEAL, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>🐈</div>
        </div>
      </section>

      {/* ─── FAVORITOS ──────────────────────────────────── */}
      <section style={{ maxWidth: 960, margin: '0 auto 2.5rem', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.25rem', margin: 0 }}>Favoritos para tu mascota</h2>
          <Link to="/products" style={{ color: TEAL, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>Ver todos →</Link>
        </div>
        <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: '1.25rem' }}>Los más vendidos del catálogo</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '1rem' }}>
          {[
            { badge: 'Super Premium', label: 'Nutra Nuggets',  name: 'Alimento Premium PRD001', price: 42900, emoji: '🐶', bg: LIGHT_TEAL },
            { badge: 'Grain Free',    label: 'Taste of Wild',  name: 'Alimento Premium PRD003', price: 38900, emoji: '🐱', bg: LIGHT_ORANGE },
            { badge: 'Más vendido',   label: 'Savic',          name: 'Comedero Cena Antideslizante', price: 28900, emoji: '🥣', bg: LIGHT_TEAL },
            { badge: 'Natural',       label: 'Dentalight',     name: 'Dental Bone 3" x 5 uds',  price: 22900, emoji: '🦴', bg: LIGHT_ORANGE },
          ].map((p) => (
            <div key={p.name} style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0' }}>
              <div style={{ background: p.bg, height: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ position: 'absolute', top: 10, left: 10, background: TEAL, color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 999 }}>{p.badge}</span>
                <span style={{ fontSize: '3rem' }}>{p.emoji}</span>
              </div>
              <div style={{ padding: '0.75rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#888', margin: '0 0 0.2rem' }}>{p.label}</p>
                <p style={{ fontWeight: 700, fontSize: '0.88rem', margin: '0 0 0.5rem', lineHeight: 1.3 }}>{p.name}</p>
                <p style={{ fontWeight: 800, color: DARK_TEAL, margin: '0 0 0.75rem', fontSize: '0.95rem' }}>${p.price.toLocaleString()}</p>
                <Link to="/products">
                  <button style={{ width: '100%', background: ORANGE, color: '#fff', border: 'none', borderRadius: 8, padding: '0.5rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}>
                    Agregar al carrito
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── BENEFICIOS ─────────────────────────────────── */}
      <section style={{ background: TEAL, padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1.5rem' }}>
          {BENEFITS.map((b) => (
            <div key={b.title} style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{b.icon}</div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.25rem' }}>{b.title}</p>
              <p style={{ fontSize: '0.78rem', opacity: 0.82, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer style={{ background: DARK_FOOTER, color: '#ccc', padding: '2.5rem 1.5rem 1rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '2rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ color: TEAL, fontWeight: 800, fontSize: '1.1rem', margin: '0 0 0.5rem' }}>VirtualPet 🐾</h3>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.7, margin: 0, opacity: 0.8 }}>
              Pasión por las mascotas.<br />Tu tienda online de confianza<br />para perros y gatos en Colombia.
            </p>
          </div>
          <div>
            <h4 style={{ color: ORANGE, margin: '0 0 0.75rem', fontWeight: 700 }}>Categorías</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {FOOTER_CATS.map((c) => (
                <li key={c}><Link to="/products" style={{ color: '#ccc', textDecoration: 'none', fontSize: '0.83rem' }}>{c}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: ORANGE, margin: '0 0 0.75rem', fontWeight: 700 }}>Marcas destacadas</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {['Nutra Nuggets','Taste of the Wild','Diamond Naturals','Nutra Gold','Petmate','Savic','Chuckit!'].map((m) => (
                <li key={m} style={{ color: '#ccc', fontSize: '0.83rem' }}>{m}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: ORANGE, margin: '0 0 0.75rem', fontWeight: 700 }}>Contáctanos</h4>
            <p style={{ fontSize: '0.83rem', lineHeight: 1.9, margin: 0, opacity: 0.85 }}>
              📞 +57 3103852168<br />
              📧 virtual.pet@hotmail.com<br />
              📍 Medellín, Colombia<br />
              🕐 Lun – Sáb: 7am – 8pm<br />
              🕐 Dom: 9am – 1pm
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', textAlign: 'center', fontSize: '0.75rem', opacity: 0.5 }}>
          © 2025 VirtualPet · Todos los derechos reservados · Políticas de privacidad · Términos y condiciones
        </div>
      </footer>
    </div>
  )
}
