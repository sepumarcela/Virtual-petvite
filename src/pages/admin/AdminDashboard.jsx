// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminProductosService, adminPedidosService, adminClientesService } from '../../api/adminService'

const ESTADO_META = {
  PENDIENTE:  { cls: 'adm-badge-pending',  label: 'Pendiente' },
  CONFIRMADO: { cls: 'adm-badge-confirm',  label: 'Confirmado' },
  EN_CAMINO:  { cls: 'adm-badge-shipping', label: 'En camino' },
  ENTREGADO:  { cls: 'adm-badge-ok',       label: 'Entregado' },
  CANCELADO:  { cls: 'adm-badge-inactive', label: 'Cancelado' },
}

function StatCard({ icon, value, label, color, bg }) {
  return (
    <div className="adm-card" style={{ padding:16, display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ width:44, height:44, borderRadius:12, background:bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <i className={`ti ${icon}`} style={{ fontSize:22, color }} />
      </div>
      <div>
        <div style={{ fontFamily:'var(--adm-font)', fontSize:24, fontWeight:800, color:'var(--adm-text)', lineHeight:1 }}>{value ?? '—'}</div>
        <div style={{ fontSize:11, color:'var(--adm-text-muted)', marginTop:3 }}>{label}</div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState(null)
  const [pedidos,   setPedidos]   = useState(null)
  const [clientes,  setClientes]  = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      adminProductosService.getAll(0, 5),
      adminPedidosService.getAll(0, 5),
      adminClientesService.getAll(0, 5),
    ]).then(([p, pe, c]) => {
      setProductos(p.data); setPedidos(pe.data); setClientes(c.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const fmt = (v) => v != null ? '$' + Number(v).toLocaleString('es-CO') : '—'

  const timeAgo = (d) => {
    if (!d) return ''
    const diff = (Date.now() - new Date(d)) / 60000
    if (diff < 60)   return `hace ${Math.round(diff)} min`
    if (diff < 1440) return `hace ${Math.round(diff/60)} h`
    return `hace ${Math.round(diff/1440)} días`
  }

  const pendientes = pedidos?.content?.filter(p => p.estado === 'PENDIENTE').length ?? '—'

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        <StatCard icon="ti-package"       value={productos?.totalElements} label="Productos"  color="var(--adm-teal)"      bg="var(--adm-teal-light)" />
        <StatCard icon="ti-shopping-cart" value={pedidos?.totalElements}   label="Pedidos"    color="var(--adm-amber-dark)" bg="var(--adm-amber-light)" />
        <StatCard icon="ti-clock"         value={pendientes}                label="Pendientes" color="#C0392B"               bg="#FDF0F0" />
        <StatCard icon="ti-users"         value={clientes?.totalElements}  label="Clientes"   color="var(--adm-teal)"      bg="var(--adm-teal-light)" />
      </div>

      {/* Últimos productos + pedidos */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14 }}>

        {/* Productos */}
        <div className="adm-card">
          <div className="adm-card-header">
            <span className="adm-card-title">
              <i className="ti ti-package" style={{ color:'var(--adm-teal)', marginRight:8 }} />
              Últimos productos
            </span>
            <div style={{ display:'flex', gap:6 }}>
              <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => navigate('/admin/importar')}>
                <i className="ti ti-file-spreadsheet" /> Excel
              </button>
              <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => navigate('/admin/productos')}>
                <i className="ti ti-plus" /> Nuevo
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding:30, textAlign:'center', color:'var(--adm-text-muted)' }}>Cargando…</div>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style={{ textAlign:'right' }}>Precio</th>
                  <th style={{ textAlign:'center' }}>Stock</th>
                  <th style={{ textAlign:'center' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {(productos?.content ?? []).map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:8, background:'var(--adm-teal-light)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                          {p.imagenUrl
                            ? <img src={p.imagenUrl} alt={p.nombre} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                            : <i className="ti ti-photo-off" style={{ color:'var(--adm-teal)', fontSize:16 }} />}
                        </div>
                        <div>
                          <div style={{ fontSize:12, fontWeight:600 }}>{p.nombre}</div>
                          <div style={{ fontSize:10, color:'var(--adm-text-muted)' }}>{p.marca} · {p.referencia}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign:'right', fontWeight:700, color:'var(--adm-teal-dark)', fontSize:13 }}>{fmt(p.precio)}</td>
                    <td style={{ textAlign:'center', fontSize:12 }}>{p.stock}</td>
                    <td style={{ textAlign:'center' }}>
                      <span className={`adm-badge ${p.activo ? 'adm-badge-ok' : 'adm-badge-inactive'}`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="adm-card-footer" onClick={() => navigate('/admin/productos')}>Ver todos los productos →</div>
        </div>

        {/* Pedidos */}
        <div className="adm-card">
          <div className="adm-card-header">
            <span className="adm-card-title">
              <i className="ti ti-shopping-cart" style={{ color:'var(--adm-amber-dark)', marginRight:8 }} />
              Pedidos recientes
            </span>
          </div>
          <div style={{ padding:'10px 14px', display:'flex', flexDirection:'column', gap:8, maxHeight:320, overflowY:'auto' }}>
            {loading ? (
              <div style={{ padding:20, textAlign:'center', color:'var(--adm-text-muted)' }}>Cargando…</div>
            ) : (pedidos?.content ?? []).length === 0 ? (
              <div style={{ padding:20, textAlign:'center', color:'var(--adm-text-muted)' }}>Sin pedidos aún</div>
            ) : (pedidos?.content ?? []).map(p => {
              const est = ESTADO_META[p.estado] || { cls:'', label: p.estado }
              return (
                <div key={p.id} style={{ border:'0.5px solid var(--adm-border-light)', borderRadius:10, padding:'11px 13px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:12, fontWeight:700, fontFamily:'var(--adm-font)' }}>{p.numeroPedido}</span>
                    <span className={`adm-badge ${est.cls}`}>{est.label}</span>
                  </div>
                  <div style={{ fontSize:11, color:'var(--adm-text-muted)', margin:'3px 0' }}>
                    {p.cliente?.nombre || '—'} · {p.cliente?.ciudad || ''}
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontSize:10, color:'var(--adm-text-muted)' }}>{timeAgo(p.creadoEn)}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:'var(--adm-teal-dark)' }}>{fmt(p.total)}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="adm-card-footer" onClick={() => navigate('/admin/pedidos')}>Ver todos los pedidos →</div>
        </div>
      </div>

      {/* Banners importación */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <div
          onClick={() => navigate('/admin/importar')}
          style={{ background:'linear-gradient(135deg,#144545,#1E6666)', borderRadius:14, padding:'18px 22px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}
        >
          <div>
            <div style={{ fontFamily:'var(--adm-font)', fontSize:13, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
              <i className="ti ti-file-spreadsheet" style={{ color:'var(--adm-amber)' }} />
              Importación masiva de productos
            </div>
            <div style={{ fontSize:12, color:'#aee8e8' }}>Carga hasta 500+ productos desde Excel de una vez</div>
          </div>
          <button className="adm-btn adm-btn-amber adm-btn-sm">
            <i className="ti ti-upload" /> Subir Excel
          </button>
        </div>

        <div
          onClick={() => navigate('/admin/importar')}
          style={{ background:'linear-gradient(135deg,#2A5F8F,#1E4470)', borderRadius:14, padding:'18px 22px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}
        >
          <div>
            <div style={{ fontFamily:'var(--adm-font)', fontSize:13, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
              <i className="ti ti-photo-up" style={{ color:'#7FD4FF' }} />
              Cargar imágenes a Cloudinary
            </div>
            <div style={{ fontSize:12, color:'#a8d8ff' }}>Sube fotos masivamente — se actualizan en la BD</div>
            <div style={{ fontSize:10, color:'rgba(168,216,255,.7)', marginTop:3 }}>Nombrar: PRD001-1kg.jpg</div>
          </div>
          <button className="adm-btn adm-btn-sm" style={{ background:'#7FD4FF', color:'#1E2D3D' }}>
            <i className="ti ti-photo-up" /> Subir fotos
          </button>
        </div>
      </div>
    </div>
  )
}
