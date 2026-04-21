// ─────────────────────────────────────────────
//  pages/LoginPage.jsx
//  HU05: Navegación entre Login y Registro
//  HU06: Formulario con useState
//  HU07: Petición POST al backend
//  HU09: SweetAlert2 para feedback
//  HU10: localStorage para persistir sesión
// ─────────────────────────────────────────────
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { authService } from '../api/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  // HU06: Captura de datos con useState
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)

  const redirectTo = location.state?.from?.pathname || '/dashboard'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email)    newErrors.email    = 'El correo es obligatorio'
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria'
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Ingresa un correo válido'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      // HU07: Petición al backend usando el servicio centralizado
      const data = await authService.login(formData)

      // HU10: Guardar sesión en localStorage via contexto
      login(data.user, data.token)

      // HU09: SweetAlert2 — éxito
      await Swal.fire({
        title: `¡Bienvenido, ${data.user.name}!`,
        text: 'Has iniciado sesión correctamente.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false,
      })
      navigate(redirectTo, { replace: true })
    } catch (error) {
      // HU09: SweetAlert2 — error
      Swal.fire({
        title: 'Error al iniciar sesión',
        text: error.response?.data?.message || 'Credenciales inválidas. Intenta de nuevo.',
        icon: 'error',
        confirmButtonColor: '#2D6A4F',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🐾</span>
          <h2>Iniciar sesión</h2>
          <p className="auth-subtitle">Accede a tu cuenta de PetShop</p>
        </div>

        {/* HU06: Formulario controlado con useState */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              name="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              className={`form-control ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {/* HU05: Enlace directo a Registro */}
        <p className="auth-link">
          ¿No tienes cuenta?{' '}
          <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}
