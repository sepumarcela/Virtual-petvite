

const PLACEHOLDERS = {
  snacks:      { emoji: '🦴', bg: 'linear-gradient(135deg, #FFF3E0, #FFE0B2)', label: 'Snack' },
  juguetes:    { emoji: '🧸', bg: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', label: 'Juguete' },
  aseo:        { emoji: '🛁', bg: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', label: 'Aseo' },
  collares:    { emoji: '🐕', bg: 'linear-gradient(135deg, #F3E5F5, #E1BEE7)', label: 'Colares' },
  comederos:   { emoji: '🥣', bg: 'linear-gradient(135deg, #E0F7FA, #B2EBF2)', label: 'Comedero' },
  transporte:  { emoji: '🧳', bg: 'linear-gradient(135deg, #FBE9E7, #FFCCBC)', label: 'Transporte' },
  food:        { emoji: '🐾', bg: 'linear-gradient(135deg, #FFF9C4, #FFF176)', label: 'Alimento' },
  default:     { emoji: '🐾', bg: 'linear-gradient(135deg, #F0F4F0, #E0E8E0)', label: 'Producto' },
}

export default function CategoryPlaceholder({ categoryId, size = 160, fontSize = '3rem' }) {
  const p = PLACEHOLDERS[categoryId] || PLACEHOLDERS.default
  return (
    <div style={{
      background: p.bg,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize,
    }}>
      {p.emoji}
    </div>
  )
}
