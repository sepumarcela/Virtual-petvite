// api/config.js
import axios from 'axios'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const ENDPOINTS = {
  LOGIN:         '/auth/login',
  REGISTER:      '/auth/register',
  LOGOUT:        '/auth/logout',
  PRODUCTS:      '/api/products',
  PRODUCT_BY_ID: (id) => `/api/products/${id}`,
  FOOD:          '/api/food',
  FOOD_BY_ID:    (id) => `/api/food/${id}`,
  CATEGORIES:    '/api/categories',
  ORDERS:        '/api/orders',
  ORDER_BY_ID:   (id) => `/api/orders/${id}`,
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Adjunta el token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('petshop_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirige al login si el token expira (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('petshop_token')
      localStorage.removeItem('petshop_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
