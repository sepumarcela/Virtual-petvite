// src/api/productService.js
// Servicio de productos — listo para conectar al backend Spring Boot
// Mientras el backend no esté activo, usa PRODUCTOS_DATA como fallback

import api from './config'
import { PRODUCTOS_DATA } from '../data/productosData'

// ── Categorías locales (sin backend) ─────────────────────
const CATEGORIES_LOCAL = [
  { id: 'alimentos',  name: 'Alimentos' },
  { id: 'snacks',     name: 'Snacks' },
  { id: 'juguetes',   name: 'Juguetes' },
  { id: 'aseo',       name: 'Aseo y Cuidado' },
  { id: 'collares',   name: 'Collares y Traillas' },
  { id: 'comederos',  name: 'Comederos y Bebederos' },
  { id: 'transporte', name: 'Transporte' },
]

// ── Helpers ───────────────────────────────────────────────
const toFrontend = (p) => ({
  id:           p.id          ?? p.referencia,
  name:         p.nombre      ?? p.name,
  brand:        p.marca       ?? p.brand        ?? '',
  description:  p.descripcion ?? p.description  ?? '',
  price:        p.precio      ?? p.price        ?? 0,
  stock:        p.stock       ?? 0,
  category:     p.categoria   ?? p.category     ?? '',
  categoryId:   p.categoryId  ?? (p.categoria?.toLowerCase()) ?? '',
  presentation: p.presentaciones ?? p.presentation ?? '',
  code:         p.referencia  ?? p.code         ?? '',
  species:      p.especie     ?? p.species       ?? '',
  availability: p.disponibilidad ?? p.availability ?? 'DISPONIBLE',
  image:        p.imagenUrl   ?? p.image         ?? null,
  subtitle:     p.subtitle    ?? '',
  target:       p.target      ?? '',
  type:         p.type        ?? '',
  petType:      p.especie     ?? p.petType       ?? '',
  weight:       p.presentation ?? p.weight       ?? '',
})

export const productService = {

  // ── GET — todos los productos ─────────────────────────
  getAll: async () => {
    try {
      const res = await api.get('/productos/dto')
      return Array.isArray(res.data)
        ? res.data.map(toFrontend)
        : (res.data.content ?? []).map(toFrontend)
    } catch {
      // Fallback a datos locales
      return PRODUCTOS_DATA.map(toFrontend)
    }
  },

  // ── GET — producto por ID ─────────────────────────────
  getById: async (id) => {
    try {
      const res = await api.get(`/productos/${id}`)
      return toFrontend(res.data)
    } catch {
      const local = PRODUCTOS_DATA.find(p => p.id === id || p.id === String(id))
      if (local) return toFrontend(local)
      throw new Error('Producto no encontrado')
    }
  },

  // ── GET — alimentos (categoría alimentos) ─────────────
  getAllFood: async () => {
    try {
      const res = await api.get('/productos/dto?categoria=alimentos')
      const data = Array.isArray(res.data) ? res.data : (res.data.content ?? [])
      return data.map(toFrontend)
    } catch {
      return PRODUCTOS_DATA
        .filter(p => p.categoryId === 'alimentos')
        .map(toFrontend)
    }
  },

  // ── GET — categorías ──────────────────────────────────
  getCategories: async () => {
    try {
      const res = await api.get('/productos/categorias')
      return res.data
    } catch {
      return CATEGORIES_LOCAL
    }
  },

  // ── POST — crear producto (admin) ─────────────────────
  create: async (data) => {
    const res = await api.post('/api/admin/productos', {
      nombre:         data.name        ?? data.nombre,
      marca:          data.brand       ?? data.marca,
      categoria:      data.category    ?? data.categoria,
      descripcion:    data.description ?? data.descripcion,
      precio:         Number(data.price ?? data.precio),
      stock:          Number(data.stock ?? 0),
      especie:        data.petType     ?? data.especie     ?? '',
      presentaciones: data.presentation ?? data.presentaciones ?? '',
      activo:         true,
    })
    return toFrontend(res.data)
  },

  // ── PUT — actualizar producto (admin) ─────────────────
  update: async (id, data) => {
    const res = await api.put(`/api/admin/productos/${id}`, {
      nombre:         data.name        ?? data.nombre,
      marca:          data.brand       ?? data.marca,
      categoria:      data.category    ?? data.categoria,
      descripcion:    data.description ?? data.descripcion,
      precio:         Number(data.price ?? data.precio),
      stock:          Number(data.stock ?? 0),
      especie:        data.petType     ?? data.especie     ?? '',
      presentaciones: data.presentation ?? data.presentaciones ?? '',
      activo:         data.activo      ?? true,
    })
    return toFrontend(res.data)
  },

  // ── DELETE — eliminar producto (admin) ────────────────
  delete: async (id) => {
    await api.delete(`/api/admin/productos/${id}`)
    return { success: true, id }
  },

  // ── PATCH — activar/desactivar ────────────────────────
  toggleActivo: async (id) => {
    const res = await api.patch(`/api/admin/productos/${id}/toggle`)
    return toFrontend(res.data)
  },

  // ── PATCH — actualizar precio ─────────────────────────
  updatePrecio: async (id, precio) => {
    const res = await api.patch(`/api/admin/productos/${id}/precio`, { precio })
    return toFrontend(res.data)
  },

  // ── PATCH — actualizar stock ──────────────────────────
  updateStock: async (id, stock) => {
    const res = await api.patch(`/api/admin/productos/${id}/stock`, { stock })
    return toFrontend(res.data)
  },
}
