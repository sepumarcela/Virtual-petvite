// pages/RegisterPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { authService } from '../api/authService'
import { validateRegister } from '../helpers/validators'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateRegister(formData)
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    setLoading(true)
    try {
      const { name, email, password } = formData
      const data = await authService.register({ name, email, password })
      login(data.user, data.token)
      await Swal.fire({
        title: `¡Bienvenido, ${data.user.name}! 🐾`,
        text: 'Tu cuenta fue creada exitosamente.',
        icon: 'success', timer: 1800, showConfirmButton: false,
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      Swal.fire({
        title: 'Error al registrarse',
        text: error.response?.data?.message || 'No se pudo crear la cuenta. Intenta de nuevo.',
        icon: 'error', confirmButtonColor: '#2D6A4F',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🐾</span>
          <h2>Crear cuenta</h2>
          <p className="auth-subtitle">Únete a PetShop Virtual</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {[
            { id: 'name',     type: 'text',     label: 'Nombre completo',      placeholder: 'Tu nombre',           autoComplete: 'name' },
            { id: 'email',    type: 'email',    label: 'Correo electrónico',   placeholder: 'tu@correo.com',       autoComplete: 'email' },
            { id: 'password', type: 'password', label: 'Contraseña',           placeholder: 'Mínimo 6 caracteres', autoComplete: 'new-password' },
            { id: 'confirm',  type: 'password', label: 'Confirmar contraseña', placeholder: 'Repite tu contraseña',autoComplete: 'new-password' },
          ].map(({ id, type, label, placeholder, autoComplete }) => (
            <div key={id} className="form-group">
              <label htmlFor={id}>{label}</label>
              <input
                id={id} type={type} name={id}
                className={`form-control ${errors[id] ? 'error' : ''}`}
                placeholder={placeholder}
                value={formData[id]} onChange={handleChange}
                autoComplete={autoComplete}
              />
              {errors[id] && <span className="form-error">{errors[id]}</span>}
            </div>
          ))}

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  )
}
