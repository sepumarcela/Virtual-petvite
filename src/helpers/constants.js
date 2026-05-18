// helpers/constants.js

export const STORAGE_KEYS = {
  TOKEN: 'petshop_token',
  USER:  'petshop_user',
  CART:  'petshop_cart',
}

export const ORDER_STATUS = {
  pending:   { label: 'Pendiente',  bg: '#FEF3C7', color: '#92400E' },
  confirmed: { label: 'Confirmado', bg: '#D1FAE5', color: '#065F46' },
  shipped:   { label: 'Enviado',    bg: '#DBEAFE', color: '#1E40AF' },
  delivered: { label: 'Entregado',  bg: '#F3F4F6', color: '#374151' },
  cancelled: { label: 'Cancelado',  bg: '#FEE2E2', color: '#991B1B' },
}

export const PET_TYPES = ['Perros', 'Gatos', 'Aves', 'Peces', 'Roedores']

export const ROLES = {
  ADMIN:  'admin',
  CLIENT: 'client',
}
