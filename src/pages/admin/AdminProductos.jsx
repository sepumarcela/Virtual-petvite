// src/pages/admin/AdminProductos.jsx
import { useState, useEffect, useCallback } from 'react'
import { adminProductosService } from '../../api/adminService'

const EMPTY = { nombre:'', marca:'', categoria:'', subcategoria:'', especie:'', presentaciones:'', referencia:'', descripcion:'', precio:'', stock:'', activo:true }

export default function AdminProductos() {
  const [data,    setData]    = useState({ content:[], totalElements:0, totalPages:0 })
  const [page,    setPage]    = useState(0)
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState(EMPTY)
  const [editId,  setEditId]  = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    adminProductosService.getAll(page, 15)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  const filtered = data.content.filter(p =>
    !search || [p.nombre, p.marca, p.referencia].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  const openNew = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (p) => {
    setForm({ nombre:p.nombre||'', marca:p.marca||'', categoria:p.categoria||'', subcategoria:p.subcategoria||'', especie:p.especie||'', presentaciones:p.presentaciones||'', referencia:p.referencia||'', descripcion:p.descripcion||'', precio:p.precio||'', stock:p.stock||'', activo:p.activo??true })
    setEditId(p.id); setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, precio: parseFloat(form.precio), stock: parseInt(form.stock) }
      if (editId) await adminProductosService.update(editId, payload)
      else        await adminProductosService.create(payload)
      setModal(false); toast('Producto guardado', 'ok'); load()
    } catch { toast('Error al guardar', 'err') }
    finally { setSaving(false) }
  }

  const handleToggle = async (p) => {
    try { await adminProductosService.toggleActivo(p.id); toast(`Producto ${p.activo ? 'desactivado' : 'activado'}`, 'ok'); load() }
    catch { toast('Error al cambiar estado', 'err') }
  }

  const toast = (text, type) => { setMsg({ text, type }); setTimeout(() => setMsg(null), 3000) }
  const fmt = (v) => v != null ? '$' + Number(v).toLocaleString('es-CO') : '—'

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {msg && (
        <div className={`adm-toast adm-toast-${msg.type}`}>
          <i className={`ti ${msg.type==='ok' ? 'ti-circle-check' : 'ti-alert-circle'}`} />
          {msg.text}
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
        <div>
          <h2 style={{ fontFamily:'var(--adm-font)', fontSize:18, fontWeight:800, color:'var(--adm-text)' }}>Catálogo de Productos</h2>
          <span style={{ fontSize:12, color:'var(--adm-text-muted)' }}>{data.totalElements} productos registrados</span>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <div className="adm-search">
            <i className="ti ti-search" style={{ color:'var(--adm-text-muted)', fontSize:15 }} />
            <input placeholder="Buscar producto, marca, ref…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="adm-btn adm-btn-primary" onClick={openNew}>
            <i className="ti ti-plus" /> Nuevo producto
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="adm-card">
        {loading ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--adm-text-muted)' }}>Cargando…</div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Producto</th><th>Categoría</th><th>Especie</th>
                  <th style={{ textAlign:'right' }}>Precio</th>
                  <th style={{ textAlign:'center' }}>Stock</th>
                  <th style={{ textAlign:'center' }}>Imagen</th>
                  <th style={{ textAlign:'center' }}>Estado</th>
                  <th style={{ textAlign:'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign:'center', padding:30, color:'var(--adm-text-muted)' }}>
                    {search ? 'Sin resultados para esa búsqueda' : 'Sin productos aún'}
                  </td></tr>
                ) : filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:38, height:38, borderRadius:8, background:'var(--adm-teal-light)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                          {p.imagenUrl ? <img src={p.imagenUrl} alt={p.nombre} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : <i className="ti ti-photo-off" style={{ color:'var(--adm-teal)', fontSize:16 }} />}
                        </div>
                        <div>
                          <div style={{ fontSize:13, fontWeight:600 }}>{p.nombre}</div>
                          <div style={{ fontSize:11, color:'var(--adm-text-muted)' }}>{p.marca} · {p.referencia}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize:12 }}>{p.categoria}</td>
                    <td style={{ fontSize:12 }}>{p.especie}</td>
                    <td style={{ textAlign:'right', fontWeight:700, color:'var(--adm-teal-dark)', fontSize:13 }}>{fmt(p.precio)}</td>
                    <td style={{ textAlign:'center' }}>
                      <span style={{ display:'inline-block', padding:'2px 8px', borderRadius:20, fontSize:12, fontWeight:700, background: p.stock < 5 ? 'var(--adm-err-bg)' : 'var(--adm-teal-light)', color: p.stock < 5 ? 'var(--adm-err-text)' : 'var(--adm-teal-dark)' }}>
                        {p.stock}
                      </span>
                    </td>
                    <td style={{ textAlign:'center' }}>
                      <span className={`adm-badge ${p.imagenUrl ? 'adm-badge-ok' : 'adm-badge-inactive'}`}>
                        {p.imagenUrl ? '✓ Sí' : '✗ No'}
                      </span>
                    </td>
                    <td style={{ textAlign:'center' }}>
                      <span className={`adm-badge ${p.activo ? 'adm-badge-ok' : 'adm-badge-inactive'}`}>
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:5, justifyContent:'center' }}>
                        <button className="adm-icon-btn adm-icon-edit" onClick={() => openEdit(p)} title="Editar"><i className="ti ti-pencil" /></button>
                        <button className={`adm-icon-btn ${p.activo ? 'adm-icon-warn' : 'adm-icon-ok'}`} onClick={() => handleToggle(p)} title={p.activo ? 'Desactivar' : 'Activar'}>
                          <i className={`ti ${p.activo ? 'ti-eye-off' : 'ti-eye'}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data.totalPages > 1 && (
          <div className="adm-pagination">
            <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => setPage(p => Math.max(0,p-1))} disabled={page===0}><i className="ti ti-chevron-left" /> Anterior</button>
            <span className="adm-page-info">Pág. {page+1} de {data.totalPages}</span>
            <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => setPage(p=>p+1)} disabled={page>=data.totalPages-1}>Siguiente <i className="ti ti-chevron-right" /></button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="adm-modal-overlay" onClick={() => setModal(false)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">{editId ? 'Editar producto' : 'Nuevo producto'}</h3>
              <button className="adm-icon-btn adm-icon-warn" onClick={() => setModal(false)}><i className="ti ti-x" /></button>
            </div>
            <form onSubmit={handleSave} className="adm-modal-body">
              <div className="adm-grid-2">
                {[['nombre','Nombre *','text'],['marca','Marca','text'],['categoria','Categoría','text'],['subcategoria','Subcategoría','text'],['especie','Especie','text'],['presentaciones','Presentación','text'],['referencia','Referencia','text'],].map(([id,label,type]) => (
                  <div key={id} className="adm-form-group">
                    <label className="adm-label">{label}</label>
                    <input className="adm-input" type={type} value={form[id]} onChange={e => setForm({...form,[id]:e.target.value})} required={id==='nombre'} />
                  </div>
                ))}
                <div className="adm-form-group">
                  <label className="adm-label">Precio (COP) *</label>
                  <input className="adm-input" type="number" value={form.precio} onChange={e => setForm({...form,precio:e.target.value})} required min={0} />
                </div>
                <div className="adm-form-group">
                  <label className="adm-label">Stock *</label>
                  <input className="adm-input" type="number" value={form.stock} onChange={e => setForm({...form,stock:e.target.value})} required min={0} />
                </div>
                <div className="adm-form-group" style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
                  <label className="adm-label" style={{ marginBottom:0 }}>Activo</label>
                  <input type="checkbox" checked={form.activo} onChange={e => setForm({...form,activo:e.target.checked})} />
                </div>
              </div>
              <div className="adm-form-group">
                <label className="adm-label">Descripción</label>
                <textarea className="adm-input" rows={3} value={form.descripcion} onChange={e => setForm({...form,descripcion:e.target.value})} style={{ resize:'vertical' }} />
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn adm-btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
                <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
                  {saving ? <><i className="ti ti-loader-2 adm-spin" /> Guardando…</> : <><i className="ti ti-check" /> Guardar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
