// api/orderService.js — versión local sin backend

const STORAGE_KEY = 'virtualpet_orders'

const loadOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

const saveOrders = (orders) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export const orderService = {
  getAll: async () => {
    return loadOrders()
  },

  create: async (payload) => {
    const orders = loadOrders()
    const newOrder = {
      ...payload,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    }
    saveOrders([newOrder, ...orders])
    return newOrder
  },
}
