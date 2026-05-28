// src/api/config.js
// Configuración base de Axios — apunta al backend Spring Boot en :8080

import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const ENDPOINTS = {
  // Auth
  LOGIN:    '/api/admin/auth/login',
  ME:       '/api/admin/auth/me',

  // Productos (público)
  PRODUCTS:      '/productos/dto',
  PRODUCT_BY_ID: (id) => `/productos/${id}`,
  CATEGORIES:    '/productos/categorias',

  // Productos (admin)
  ADMIN_PRODUCTS:         '/api/admin/productos',
  ADMIN_PRODUCT_BY_ID:    (id) => `/api/admin/productos/${id}`,
  ADMIN_PRODUCT_TOGGLE:   (id) => `/api/admin/productos/${id}/toggle`,
  ADMIN_PRODUCT_PRECIO:   (id) => `/api/admin/productos/${id}/precio`,
  ADMIN_PRODUCT_STOCK:    (id) => `/api/admin/productos/${id}/stock`,

  // Pedidos (admin)
  ADMIN_PEDIDOS:          '/api/admin/pedidos',
  ADMIN_PEDIDO_ESTADO:    (id) => `/api/admin/pedidos/${id}/estado`,

  // Clientes (admin)
  ADMIN_CLIENTES:         '/api/admin/clientes',
  ADMIN_CLIENTE_BY_ID:    (id) => `/api/admin/clientes/${id}`,
  ADMIN_CLIENTE_TOGGLE:   (id) => `/api/admin/clientes/${id}/toggle`,

  // Pedidos (público)
  ORDERS:      '/pedidos',
  ORDER_BY_ID: (id) => `/pedidos/${id}`,
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Adjunta el token en cada request
api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('vp_admin_token') ||
    localStorage.getItem('petshop_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vp_admin_token')
      localStorage.removeItem('vp_admin_user')
      localStorage.removeItem('petshop_token')
      localStorage.removeItem('petshop_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
