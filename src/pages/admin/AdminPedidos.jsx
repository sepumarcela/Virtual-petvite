// src/pages/admin/AdminPedidos.jsx
import { useState, useEffect, useCallback } from 'react'
import { adminPedidosService } from '../../api/adminService'

const ESTADOS = ['PENDIENTE','CONFIRMADO','EN_CAMINO','ENTREGADO','CANCELADO']
const ESTADO_META = {
  PENDIENTE:  { cls:'adm-badge-pending',  label:'Pendiente' },
  CONFIRMADO: { cls:'adm-badge-confirm',  label:'Confirmado' },
  EN_CAMINO:  { cls:'adm-badge-shipping', label:'En camino' },
  ENTREGADO:  { cls:'adm-badge-ok',       label:'Entregado' },
  CANCELADO:  { cls:'adm-badge-inactive', label:'Cancelado' },
}

export default function AdminPedidos() {
  const [data,    setData]    = useState({ content:[], totalElements:0, totalPages:0 })
  const [page,    setPage]    = useState(0)
  const [loading, setLoading] = useState(true)
  const [detail,  setDetail]  = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    adminPedidosService.getAll(page, 15)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page])

  useEffect(() => { load() }, [load])

  const handleEstado = async (id, estado) => {
    setSaving(true)
    try {
      await adminPedidosService.updateEstado(id, estado)
      toast('Estado actualizado', 'ok'); setDetail(null); load()
    } catch { toast('Error al actualizar', 'err') }
    finally { setSaving(false) }
  }

  const toast = (text, type) => { setMsg({ text, type }); setTimeout(() => setMsg(null), 3000) }
  const fmt = (v) => v != null ? '$' + Number(v).toLocaleString('es-CO') : '—'
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' }) : '—'

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {msg && (
        <div className={`adm-toast adm-toast-${msg.type}`}>
          <i className={`ti ${msg.type==='ok' ? 'ti-circle-check' : 'ti-alert-circle'}`} />
          {msg.text}
        </div>
      )}

      <div>
        <h2 style={{ fontFamily:'var(--adm-font)', fontSize:18, fontWeight:800 }}>Pedidos</h2>
        <span style={{ fontSize:12, color:'var(--adm-text-muted)' }}>{data.totalElements} pedidos registrados</span>
      </div>

      <div className="adm-card">
        {loading ? (
          <div style={{ padding:40, textAlign:'center', color:'var(--adm-text-muted)' }}>Cargando…</div>
        ) : (
          <table className="adm-table">
            <thead>
              <tr>
                <th>Número</th><th>Cliente</th><th>Ciudad</th>
                <th style={{ textAlign:'right' }}>Total</th>
                <th style={{ textAlign:'center' }}>Estado</th>
                <th>Fecha</th>
                <th style={{ textAlign:'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.content.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:30, color:'var(--adm-text-muted)' }}>Sin pedidos aún</td></tr>
              ) : data.content.map(p => {
                const est = ESTADO_META[p.estado] || { cls:'', label:p.estado }
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight:700, fontFamily:'var(--adm-font)', fontSize:12 }}>{p.numeroPedido}</td>
                    <td>{p.cliente?.nombre || '—'}</td>
                    <td style={{ fontSize:12, color:'var(--adm-text-muted)' }}>{p.cliente?.ciudad || '—'}</td>
                    <td style={{ textAlign:'right', fontWeight:700, color:'var(--adm-teal-dark)' }}>{fmt(p.total)}</td>
                    <td style={{ textAlign:'center' }}><span className={`adm-badge ${est.cls}`}>{est.label}</span></td>
                    <td style={{ fontSize:12, color:'var(--adm-text-muted)' }}>{fmtDate(p.creadoEn)}</td>
                    <td style={{ textAlign:'center' }}>
                      <button className="adm-icon-btn adm-icon-edit" onClick={() => setDetail(p)} title="Ver detalle">
                        <i className="ti ti-eye" />
                      </button>
                    </td>
                  </tr>
                )
              })}
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

      {/* Modal detalle */}
      {detail && (
        <div className="adm-modal-overlay" onClick={() => setDetail(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <h3 className="adm-modal-title">Pedido {detail.numeroPedido}</h3>
              <button className="adm-icon-btn adm-icon-warn" onClick={() => setDetail(null)}><i className="ti ti-x" /></button>
            </div>
            <div className="adm-modal-body">
              <div className="adm-grid-2">
                {[['Cliente',detail.cliente?.nombre],['Teléfono',detail.cliente?.telefono],['Ciudad',detail.cliente?.ciudad],['Dirección',detail.cliente?.direccion],['Total',fmt(detail.total)],['Creado',fmtDate(detail.creadoEn)]].map(([l,v]) => (
                  <div key={l}>
                    <div style={{ fontSize:10, fontWeight:700, color:'var(--adm-text-muted)', textTransform:'uppercase', letterSpacing:.4, marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:13, fontWeight:500 }}>{v || '—'}</div>
                  </div>
                ))}
              </div>
              <div>
                <label className="adm-label" style={{ marginBottom:8 }}>Cambiar estado del pedido</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {ESTADOS.map(est => {
                    const m = ESTADO_META[est]
                    return (
                      <button key={est} className={`adm-badge ${m.cls}`}
                        style={{ cursor:'pointer', border: detail.estado===est ? '2px solid currentColor' : '2px solid transparent', padding:'6px 14px', fontSize:12 }}
                        onClick={() => handleEstado(detail.id, est)} disabled={saving || detail.estado===est}>
                        {m.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
