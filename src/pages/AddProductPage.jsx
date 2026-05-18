// pages/AddProductPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../api/productService'
import { validateProduct } from '../helpers/validators'
import { PET_TYPES } from '../helpers/constants'
import Swal from 'sweetalert2'

const INITIAL = { name: '', description: '', price: '', stock: '', categoryId: '', image: '', petType: '' }

export default function AddProductPage() {
  const navigate = useNavigate()
  const [form, setForm]             = useState(INITIAL)
  const [errors, setErrors]         = useState({})
  const [loading, setLoading]       = useState(false)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    productService.getCategories().then(setCategories).catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validateProduct(form)
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }

    setLoading(true)
    try {
      await productService.create({
        ...form,
        price: Number(form.price),
        stock: form.stock !== '' ? Number(form.stock) : undefined,
      })
      await Swal.fire({
        title: '¡Producto creado! 🎉',
        text: `"${form.name}" fue agregado al catálogo.`,
        icon: 'success', confirmButtonColor: '#2D6A4F',
      })
      navigate('/products')
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo crear el producto.',
        icon: 'error', confirmButtonColor: '#2D6A4F',
      })
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ id, label, type = 'text', placeholder, as }) => (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {as === 'textarea' ? (
        <textarea id={id} name={id}
          className={`form-control ${errors[id] ? 'error' : ''}`}
          placeholder={placeholder} value={form[id]}
          onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
      ) : (
        <input id={id} name={id} type={type}
          className={`form-control ${errors[id] ? 'error' : ''}`}
          placeholder={placeholder} value={form[id]} onChange={handleChange} />
      )}
      {errors[id] && <span className="form-error">{errors[id]}</span>}
    </div>
  )

  return (
    <div className="container" style={{ padding: '2rem 1rem', maxWidth: 640 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>➕ Nuevo Producto</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
        Completa el formulario para agregar un producto al catálogo
      </p>

      <form onSubmit={handleSubmit} noValidate style={{
        background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)', padding: '2rem',
      }}>
        <Field id="name"        label="Nombre del producto *" placeholder="Ej: Croquetas Premium" />
        <Field id="description" label="Descripción *"         placeholder="Describe el producto…" as="textarea" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Field id="price" label="Precio (COP) *" type="number" placeholder="29900" />
          <Field id="stock" label="Stock"          type="number" placeholder="100" />
        </div>

        <div className="form-group">
          <label htmlFor="categoryId">Categoría</label>
          <select id="categoryId" name="categoryId" className="form-control"
            value={form.categoryId} onChange={handleChange}>
            <option value="">Selecciona una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="petType">Para mascota</label>
          <select id="petType" name="petType" className="form-control"
            value={form.petType} onChange={handleChange}>
            <option value="">Todas</option>
            {PET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <Field id="image" label="URL de imagen" placeholder="https://…" />

        {form.image && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <img src={form.image} alt="Preview"
              style={{ maxHeight: 160, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none' }} />
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }}>
            {loading ? 'Guardando…' : '✅ Guardar producto'}
          </button>
          <button type="button" className="btn btn-outline"
            onClick={() => navigate('/products')} style={{ padding: '0.75rem 1.25rem' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
