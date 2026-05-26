// api/authService.js — versión local sin backend
// Credenciales de admin: admin@virtualpet.co / admin123

const ADMIN_USER = {
  id: 1,
  name: 'Administrador',
  email: 'admin@virtualpet.co',
  role: 'admin',
}

const ADMIN_PASSWORD = 'admin123'

export const authService = {
  login: async ({ email, password }) => {
    // Simula delay de red
    await new Promise((r) => setTimeout(r, 600))

    if (
      email.trim().toLowerCase() === ADMIN_USER.email &&
      password === ADMIN_PASSWORD
    ) {
      return {
        user: ADMIN_USER,
        token: 'local-admin-token',
      }
    }

    // Lanza error como lo haría axios
    const err = new Error('Credenciales inválidas')
    err.response = { data: { message: 'Credenciales inválidas. Intenta de nuevo.' } }
    throw err
  },

  register: async () => {
    const err = new Error('Registro deshabilitado')
    err.response = { data: { message: 'El registro está deshabilitado en esta versión.' } }
    throw err
  },

  logout: async () => true,
}
