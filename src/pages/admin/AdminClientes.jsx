// src/pages/admin/AdminClientes.jsx
import { useState, useEffect, useCallback } from 'react'
import { adminClientesService } from '../../api/adminService'

export default function AdminClientes() {
  const [data,    setData]    = useState({ content:[], totalElements:0, totalPages:0 })
  const [page,    setPage]    = useState(0)
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [msg,     setMsg]     = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    adminClientesService.getAll(page, 15)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  const handleToggle = async (c) => {
    try {
      await adminClientesService.toggleActivo(c.id)
      toast(`Cliente ${c.activo ? 'desactivado' : 'activado'}`, 'ok'); load()
    } catch { toast('Error al cambiar estado', 'err') }
  }

  const toast = (text, type) => { setMsg({ text, type }); setTimeout(() => setMsg(null), 3000) }

  const filtered = data.content.filter(c =>
    !search || [c.nombre, c.email, c.ciudad].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {msg && (
        <div className={`adm-toast adm-toast-${msg.type}`}>
          <i className={`ti ${msg.type==='ok' ? 'ti-circle-check' : 'ti-alert-circle'}`} />
          {msg.text}
        </div>
      )}

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 style={{ fontFamily:'var(--adm-font)', fontSize:18, fontWeight:800 }}>Clientes</h2>
          <span style={{ fontSize:12, color:'var(--adm-text-muted)' }}>{data.totalElements} clientes registrados</span>
        </div>
        <div className="adm-search">
          <i className="ti ti-search" style={{ color:'var(--adm-text-muted)', fontSize:15 }} />
          <input placeholder="Buscar nombre, email, ciudad…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="adm-card">
        {loading ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--adm-text-muted)' }}>Cargando…</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Cliente</th><th>Email</th><th>Teléfono</th><th>Ciudad</th>
                <th style={{ textAlign:'center' }}>Estado</th>
                <th style={{ textAlign:'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:30, color:'var(--adm-text-muted)' }}>Sin clientes aún</td></tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--adm-amber)', color:'#3D2800', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:13, fontFamily:'var(--adm-font)', flexShrink:0 }}>
                        {c.nombre?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight:600, fontSize:13 }}>{c.nombre}</span>
                    </div>
                  </td>
                  <td style={{ fontSize:12, color:'var(--adm-text-muted)' }}>{c.email}</td>
                  <td style={{ fontSize:12 }}>{c.telefono}</td>
                  <td style={{ fontSize:12 }}>{c.ciudad}</td>
                  <td style={{ textAlign:'center' }}>
                    <span className={`adm-badge ${c.activo ? 'adm-badge-ok' : 'adm-badge-inactive'}`}>
                      {c.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td style={{ textAlign:'center' }}>
                    <button className={`adm-icon-btn ${c.activo ? 'adm-icon-warn' : 'adm-icon-ok'}`} onClick={() => handleToggle(c)} title={c.activo ? 'Desactivar' : 'Activar'}>
                      <i className={`ti ${c.activo ? 'ti-user-off' : 'ti-user-check'}`} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {data.totalPages > 1 && (
          <div className="adm-pagination">
            <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => setPage(p => Math.max(0,p-1))} disabled={page===0}><i className="ti ti-chevron-left" /> Anterior</button>
            <span className="adm-page-info">Pág. {page+1} de {data.totalPages}</span>
            <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => setPage(p=>p+1)} disabled={page>=data.totalPages-1}>Siguiente <i className="ti ti-chevron-right" /></button>
          </div>
        )}
      </div>
    </div>
  )
}
