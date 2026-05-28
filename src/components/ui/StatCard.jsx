// src/components/ui/StatCard.jsx
// Tarjeta de estadística reutilizable

export default function StatCard({ icon, label, value, color = 'var(--color-primary)', bg = 'var(--color-primary-bg)', borderColor }) {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: '1.25rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '1rem',
      borderLeft: borderColor ? `4px solid ${borderColor}` : undefined,
      border: borderColor ? undefined : '0.5px solid var(--color-border)',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: bg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', margin: 0 }}>
          {label}
        </p>
        <p style={{ fontSize: '1.6rem', fontWeight: 800, color, margin: 0, lineHeight: 1.2 }}>
          {value}
        </p>
      </div>
    </div>
  )
}
