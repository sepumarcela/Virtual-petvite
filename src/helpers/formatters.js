

export const formatPrice = (value, currency = 'COP') => {
  if (value == null || isNaN(value)) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value)
}


export const formatDate = (date, style = 'medium') => {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-CO', { dateStyle: style }).format(new Date(date))
}


export const truncate = (text, max = 80) => {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}


export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}


export const cartToOrderPayload = (items) => ({
  items: items.map(({ id, name, price, quantity }) => ({ productId: id, name, price, quantity })),
  total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  createdAt: new Date().toISOString(),
  status: 'pending',
})
