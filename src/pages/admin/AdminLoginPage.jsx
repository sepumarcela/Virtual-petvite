// src/pages/admin/AdminLoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { adminAuthService } from '../../api/adminService'
import '../../styles/admin.css'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { adminLogin } = useAdminAuth()
  const [form,    setForm]    = useState({ username: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)

    // ── TEMPORAL: saltar login para ver el panel sin backend ──
    adminLogin('fake-token', { username: 'admin', rol: 'SUPER_ADMIN' })
    navigate('/admin/dashboard')
    setLoading(false)
    return

    // ── REAL: descomentar cuando el backend esté corriendo ──
    // try {
    //   const res = await adminAuthService.login(form.username, form.password)
    //   const { token, username, rol } = res.data
    //   adminLogin(token, { username, rol })
    //   navigate('/admin/dashboard')
    // } catch (err) {
    //   setError(err.response?.data?.mensaje || 'Credenciales incorrectas')
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #144545 0%, #1E6666 60%, #2A8B8B 100%)',
      padding: 20, fontFamily: 'var(--adm-font)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Círculos decorativos */}
      {[
        { w:400, h:400, top:'-120px', right:'-100px', bg:'rgba(255,255,255,.05)' },
        { w:280, h:280, bottom:'-80px', left:'-60px', bg:'rgba(232,160,32,.08)' },
      ].map((s, i) => (
        <div key={i} style={{ position:'absolute', borderRadius:'50%', width:s.w, height:s.h,
          top:s.top, bottom:s.bottom, left:s.left, right:s.right, background:s.bg, pointerEvents:'none' }} />
      ))}

      <div style={{
        background: '#fff', borderRadius: 18, padding: '40px 36px',
        width: '100%', maxWidth: 400,
        boxShadow: '0 24px 60px rgba(0,0,0,.2)',
        position: 'relative', zIndex: 1,
        animation: 'admFadeIn .3s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/logo.png" alt="VirtualPet" style={{ height: 72, objectFit: 'contain' }} />
        </div>

        <h2 style={{ textAlign:'center', fontWeight:800, fontSize:22, color:'#144545', marginBottom:4 }}>
          Panel Administrativo
        </h2>
        <p style={{ textAlign:'center', fontSize:13, color:'#888', marginBottom:24 }}>
          Inicia sesión para gestionar tu tienda
        </p>

        {error && (
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            background:'#FDF0F0', color:'#C0392B',
            padding:'10px 14px', borderRadius:10,
            fontSize:13, fontWeight:500, marginBottom:16,
          }}>
            <i className="ti ti-alert-circle" style={{ fontSize:16 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { id:'username', label:'Usuario', type:'text', placeholder:'admin' },
            { id:'password', label:'Contraseña', type:'password', placeholder:'••••••••' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id} style={{ marginBottom: 16 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'#555', display:'block', marginBottom:5 }}>
                {label}
              </label>
              <input
                type={type}
                placeholder={placeholder}
                value={form[id]}
                onChange={e => setForm({ ...form, [id]: e.target.value })}
                style={{
                  width:'100%', padding:'9px 12px',
                  border:'1px solid #E8E8E8', borderRadius:10,
                  fontSize:13, outline:'none', fontFamily:'inherit',
                  transition:'border-color .15s ease',
                }}
                onFocus={e => e.target.style.borderColor = '#2A8B8B'}
                onBlur={e  => e.target.style.borderColor = '#E8E8E8'}
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width:'100%', padding:12,
              background: loading ? '#6aafaf' : '#2A8B8B',
              color:'#fff', border:'none', borderRadius:10,
              fontSize:14, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              fontFamily:'inherit', transition:'background .18s ease',
            }}
          >
            {loading ? (
              <><i className="ti ti-loader-2 adm-spin" /> Ingresando…</>
            ) : (
              <><i className="ti ti-login" /> Ingresar al panel</>
            )}
          </button>
        </form>

        <p style={{ textAlign:'center', fontSize:11, color:'#BBBBBB', marginTop:24 }}>
          VirtualPet © {new Date().getFullYear()} · Panel administrativo
        </p>
      </div>
    </div>
  )
}
