// src/api/adminService.js
// Servicio para conectar con el backend Spring Boot en localhost:8080
// JWT se guarda en localStorage con clave 'vp_admin_token'

import axios from 'axios'

const BASE = 'http://localhost:8080'

const adminApi = axios.create({ baseURL: BASE })

// Adjunta token automáticamente
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('vp_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si 401 → limpia sesión
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vp_admin_token')
      localStorage.removeItem('vp_admin_user')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

// ── AUTH ──────────────────────────────────────────────────
export const adminAuthService = {
  login: (username, password) =>
    adminApi.post('/api/admin/auth/login', { username, password }),
  me: () => adminApi.get('/api/admin/auth/me'),
}

// ── PRODUCTOS ────────────────────────────────────────────
export const adminProductosService = {
  getAll:       (page = 0, size = 15) => adminApi.get(`/api/admin/productos?page=${page}&size=${size}`),
  getById:      (id)                  => adminApi.get(`/api/admin/productos/${id}`),
  create:       (data)                => adminApi.post('/api/admin/productos', data),
  update:       (id, data)            => adminApi.put(`/api/admin/productos/${id}`, data),
  toggleActivo: (id)                  => adminApi.patch(`/api/admin/productos/${id}/toggle`),
  updatePrecio: (id, precio)          => adminApi.patch(`/api/admin/productos/${id}/precio`, { precio }),
  updateStock:  (id, stock)           => adminApi.patch(`/api/admin/productos/${id}/stock`, { stock }),
}

// ── PEDIDOS ───────────────────────────────────────────────
export const adminPedidosService = {
  getAll:       (page = 0, size = 15) => adminApi.get(`/api/admin/pedidos?page=${page}&size=${size}`),
  updateEstado: (id, estado)          => adminApi.patch(`/api/admin/pedidos/${id}/estado`, { estado }),
}

// ── CLIENTES ──────────────────────────────────────────────
export const adminClientesService = {
  getAll:       (page = 0, size = 15) => adminApi.get(`/api/admin/clientes?page=${page}&size=${size}`),
  getById:      (id)                  => adminApi.get(`/api/admin/clientes/${id}`),
  toggleActivo: (id)                  => adminApi.patch(`/api/admin/clientes/${id}/toggle`),
}

// ── IMPORTACIÓN ───────────────────────────────────────────
export const adminImportService = {
  importarExcel: (file) => {
    const form = new FormData()
    form.append('archivo', file)
    return adminApi.post('/api/admin/importar/productos', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  importarImagenes: (files) => {
    const form = new FormData()
    files.forEach((f) => form.append('archivos', f))
    return adminApi.post('/api/admin/importar/imagenes', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
