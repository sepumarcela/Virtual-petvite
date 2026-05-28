// src/api/orderService.js
// Servicio de pedidos — localStorage hasta conectar el backend

import api from './config'

const KEY = 'virtualpet_orders'

const load  = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const save  = (orders) => localStorage.setItem(KEY, JSON.stringify(orders))

export const orderService = {

  // ── GET — todos los pedidos ───────────────────────────
  getAll: async () => {
    try {
      const res = await api.get('/pedidos')
      return Array.isArray(res.data) ? res.data : (res.data.content ?? [])
    } catch {
      return load()
    }
  },

  // ── GET — pedido por ID ───────────────────────────────
  getById: async (id) => {
    try {
      const res = await api.get(`/pedidos/${id}`)
      return res.data
    } catch {
      const orders = load()
      const order = orders.find(o => o.id === id || o.id === Number(id))
      if (!order) throw new Error('Pedido no encontrado')
      return order
    }
  },

  // ── POST — crear pedido ───────────────────────────────
  create: async (payload) => {
    try {
      const res = await api.post('/pedidos', payload)
      return res.data
    } catch {
      // Fallback localStorage
      const orders = load()
      const newOrder = {
        ...payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      }
      save([newOrder, ...orders])
      return newOrder
    }
  },

  // ── PUT — actualizar pedido ───────────────────────────
  update: async (id, data) => {
    try {
      const res = await api.put(`/pedidos/${id}`, data)
      return res.data
    } catch {
      const orders = load()
      const updated = orders.map(o =>
        (o.id === id || o.id === Number(id)) ? { ...o, ...data } : o
      )
      save(updated)
      return updated.find(o => o.id === id || o.id === Number(id))
    }
  },

  // ── DELETE — eliminar pedido ──────────────────────────
  delete: async (id) => {
    try {
      await api.delete(`/pedidos/${id}`)
      return { success: true }
    } catch {
      const orders = load()
      save(orders.filter(o => o.id !== id && o.id !== Number(id)))
      return { success: true }
    }
  },
}
