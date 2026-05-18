// api/orderService.js
import api, { ENDPOINTS } from './config'

export const orderService = {
  getAll:  async ()       => (await api.get(ENDPOINTS.ORDERS)).data,
  getById: async (id)     => (await api.get(ENDPOINTS.ORDER_BY_ID(id))).data,
  create:  async (data)   => (await api.post(ENDPOINTS.ORDERS, data)).data,
  cancel:  async (id)     => (await api.patch(ENDPOINTS.ORDER_BY_ID(id), { status: 'cancelled' })).data,
}
