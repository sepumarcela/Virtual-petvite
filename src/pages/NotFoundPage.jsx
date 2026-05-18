// pages/NotFoundPage.jsx
import { Link, useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🐾</div>
      <h1 style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>¡Ups! Página no encontrada</h2>
      <p style={{ color: 'var(--color-text-muted)', marginTop: '0.75rem', maxWidth: 400 }}>
        Parece que tu mascota salió a explorar y se perdió. Esta página no existe o fue movida.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>← Volver atrás</button>
        <Link to="/" className="btn btn-outline">🏠 Ir al inicio</Link>
      </div>
    </div>
  )
}
