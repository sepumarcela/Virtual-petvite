// helpers/formatters.js

/**
 * Formatea un número como precio en COP
 */
export const formatPrice = (value, currency = 'COP') => {
  if (value == null || isNaN(value)) return '—'
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * Formatea una fecha ISO a texto legible en español
 */
export const formatDate = (date, style = 'medium') => {
  if (!date) return '—'
  return new Intl.DateTimeFormat('es-CO', { dateStyle: style }).format(new Date(date))
}

/**
 * Trunca un texto a un máximo de caracteres
 */
export const truncate = (text, max = 80) => {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max)}…` : text
}

/**
 * Capitaliza la primera letra de un string
 */
export const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convierte los items del carrito al payload de un pedido
 */
export const cartToOrderPayload = (items) => ({
  items: items.map(({ id, name, price, quantity }) => ({ productId: id, name, price, quantity })),
  total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  createdAt: new Date().toISOString(),
  status: 'pending',
})
