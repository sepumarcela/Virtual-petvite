import api, { ENDPOINTS } from './config'

export const productService = {
  getAll:       async (params = {}) => (await api.get(ENDPOINTS.PRODUCTS, { params })).data,
  getById:      async (id)          => (await api.get(ENDPOINTS.PRODUCT_BY_ID(id))).data,
  create:       async (data)        => (await api.post(ENDPOINTS.PRODUCTS, data)).data,
  update:       async (id, data)    => (await api.put(ENDPOINTS.PRODUCT_BY_ID(id), data)).data,
  remove:       async (id)          => (await api.delete(ENDPOINTS.PRODUCT_BY_ID(id))).data,
  getAllFood:    async (params = {}) => (await api.get(ENDPOINTS.FOOD, { params })).data,
  getFoodById:  async (id)          => (await api.get(ENDPOINTS.FOOD_BY_ID(id))).data,
  getCategories:async ()            => (await api.get(ENDPOINTS.CATEGORIES)).data,
}
