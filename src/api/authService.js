import api, { ENDPOINTS } from './config'

export const authService = {
  login: async (credentials) => {
    const response = await api.post(ENDPOINTS.LOGIN, credentials)
    return response.data
  },
  register: async (userData) => {
    const response = await api.post(ENDPOINTS.REGISTER, userData)
    return response.data
  },
  logout: async () => {
    await api.post(ENDPOINTS.LOGOUT)
  },
}
