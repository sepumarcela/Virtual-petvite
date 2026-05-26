// src/pages/admin/AdminImportar.jsx
import { useRef, useState } from 'react'
import { adminImportService } from '../../api/adminService'

export default function AdminImportar() {
  const excelRef = useRef()
  const imgRef   = useRef()

  const [excelFile,    setExcelFile]    = useState(null)
  const [imgFiles,     setImgFiles]     = useState([])
  const [loadingExcel, setLoadingExcel] = useState(false)
  const [loadingImg,   setLoadingImg]   = useState(false)
  const [excelResult,  setExcelResult]  = useState(null)
  const [imgResult,    setImgResult]    = useState(null)
  const [excelErr,     setExcelErr]     = useState('')
  const [imgErr,       setImgErr]       = useState('')

  const handleExcel = async () => {
    if (!excelFile) return
    setLoadingExcel(true); setExcelErr(''); setExcelResult(null)
    try {
      const r = await adminImportService.importarExcel(excelFile)
      setExcelResult(r.data); setExcelFile(null); excelRef.current.value = ''
    } catch (err) { setExcelErr(err.response?.data?.mensaje || 'Error al importar Excel') }
    finally { setLoadingExcel(false) }
  }

  const handleImgs = async () => {
    if (!imgFiles.length) return
    setLoadingImg(true); setImgErr(''); setImgResult(null)
    try {
      const r = await adminImportService.importarImagenes(imgFiles)
      setImgResult(r.data); setImgFiles([]); imgRef.current.value = ''
    } catch (err) { setImgErr(err.response?.data?.mensaje || 'Error al subir imágenes') }
    finally { setLoadingImg(false) }
  }

  const dropZoneStyle = (active) => ({
    border: `2px dashed ${active ? 'var(--adm-teal)' : 'var(--adm-border)'}`,
    borderRadius: 14, padding: '28px 20px', cursor: 'pointer',
    background: active ? 'var(--adm-teal-light)' : 'var(--adm-bg)',
    transition: 'all .18s ease', textAlign: 'center',
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <div>
        <h2 style={{ fontFamily:'var(--adm-font)', fontSize:18, fontWeight:800 }}>Importación masiva</h2>
        <span style={{ fontSize:12, color:'var(--adm-text-muted)' }}>Carga productos e imágenes desde archivos</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>

        {/* ── Excel ── */}
        <div className="adm-card" style={{ padding:24, display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:'var(--adm-teal-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <i className="ti ti-file-spreadsheet" style={{ fontSize:26, color:'var(--adm-teal)' }} />
          </div>
          <h3 style={{ fontFamily:'var(--adm-font)', fontSize:16, fontWeight:800, margin:0 }}>Importar productos desde Excel</h3>
          <p style={{ fontSize:13, color:'var(--adm-text-muted)', lineHeight:1.6, margin:0 }}>
            Sube el archivo Excel con el catálogo. Se crearán o actualizarán los productos automáticamente.
          </p>

          <div style={{ display:'flex', alignItems:'flex-start', gap:8, background:'var(--adm-amber-light)', borderRadius:10, padding:'10px 12px', fontSize:12, color:'var(--adm-amber-dark)' }}>
            <i className="ti ti-info-circle" style={{ fontSize:15, flexShrink:0, marginTop:1 }} />
            <span>Columnas requeridas: ID, Nombre, Marca, Categoría, Descripción, Precio, Stock</span>
          </div>

          <div
            style={dropZoneStyle(!!excelFile)}
            onClick={() => excelRef.current.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); setExcelFile(e.dataTransfer.files[0]) }}
          >
            <input ref={excelRef} type="file" accept=".xlsx,.xls" style={{ display:'none' }}
              onChange={e => setExcelFile(e.target.files[0])} />
            {excelFile ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, color:'var(--adm-teal-dark)' }}>
                <i className="ti ti-file-check" style={{ fontSize:22 }} />
                <span style={{ fontSize:13, fontWeight:600 }}>{excelFile.name}</span>
                <button onClick={e => { e.stopPropagation(); setExcelFile(null); excelRef.current.value='' }}
                  style={{ border:'none', background:'var(--adm-err-bg)', color:'var(--adm-err-text)', borderRadius:6, padding:'3px 6px', cursor:'pointer', fontSize:13 }}>
                  <i className="ti ti-x" />
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, color:'var(--adm-text-muted)' }}>
                <i className="ti ti-upload" style={{ fontSize:32, color:'var(--adm-text-hint)' }} />
                <span style={{ fontSize:13 }}>Arrastra tu Excel aquí o <strong style={{ color:'var(--adm-teal)' }}>haz clic</strong></span>
                <span style={{ fontSize:11, color:'var(--adm-text-hint)' }}>.xlsx · .xls</span>
              </div>
            )}
          </div>

          {excelErr && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--adm-err-bg)', color:'var(--adm-err-text)', padding:'10px 14px', borderRadius:10, fontSize:13, fontWeight:500 }}>
              <i className="ti ti-alert-circle" />{excelErr}
            </div>
          )}

          {excelResult && (
            <div style={{ background:'var(--adm-ok-bg)', borderRadius:10, padding:'12px 14px', display:'flex', flexDirection:'column', gap:6 }}>
              {[['✅ Importados', excelResult.importados ?? excelResult.total ?? '—'],['⚠️ Errores', excelResult.errores ?? 0]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--adm-ok-text)' }}>
                  <span>{l}</span><strong>{v}</strong>
                </div>
              ))}
            </div>
          )}

          <button className="adm-btn adm-btn-primary" style={{ justifyContent:'center', padding:12 }}
            onClick={handleExcel} disabled={!excelFile || loadingExcel}>
            {loadingExcel ? <><i className="ti ti-loader-2 adm-spin" /> Importando…</> : <><i className="ti ti-upload" /> Importar productos</>}
          </button>
        </div>

        {/* ── Imágenes ── */}
        <div className="adm-card" style={{ padding:24, display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:'#E3F2FD', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <i className="ti ti-photo-up" style={{ fontSize:26, color:'#1565C0' }} />
          </div>
          <h3 style={{ fontFamily:'var(--adm-font)', fontSize:16, fontWeight:800, margin:0 }}>Subir imágenes a Cloudinary</h3>
          <p style={{ fontSize:13, color:'var(--adm-text-muted)', lineHeight:1.6, margin:0 }}>
            Sube las fotos de los productos. Se asocian automáticamente según el nombre del archivo.
          </p>

          <div style={{ display:'flex', alignItems:'flex-start', gap:8, background:'var(--adm-amber-light)', borderRadius:10, padding:'10px 12px', fontSize:12, color:'var(--adm-amber-dark)' }}>
            <i className="ti ti-info-circle" style={{ fontSize:15, flexShrink:0, marginTop:1 }} />
            <span>Nombrar igual que la referencia: <strong>PRD001-1kg.jpg</strong></span>
          </div>

          <div
            style={dropZoneStyle(imgFiles.length > 0)}
            onClick={() => imgRef.current.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); setImgFiles([...e.dataTransfer.files]) }}
          >
            <input ref={imgRef} type="file" accept="image/*" multiple style={{ display:'none' }}
              onChange={e => setImgFiles([...e.target.files])} />
            {imgFiles.length > 0 ? (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, color:'var(--adm-teal-dark)' }}>
                <i className="ti ti-photos" style={{ fontSize:22 }} />
                <span style={{ fontSize:13, fontWeight:600 }}>{imgFiles.length} imagen{imgFiles.length > 1 ? 'es' : ''} seleccionada{imgFiles.length > 1 ? 's' : ''}</span>
                <button onClick={e => { e.stopPropagation(); setImgFiles([]); imgRef.current.value='' }}
                  style={{ border:'none', background:'var(--adm-err-bg)', color:'var(--adm-err-text)', borderRadius:6, padding:'3px 6px', cursor:'pointer', fontSize:13 }}>
                  <i className="ti ti-x" />
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, color:'var(--adm-text-muted)' }}>
                <i className="ti ti-photo-up" style={{ fontSize:32, color:'var(--adm-text-hint)' }} />
                <span style={{ fontSize:13 }}>Arrastra las fotos aquí o <strong style={{ color:'var(--adm-teal)' }}>haz clic</strong></span>
                <span style={{ fontSize:11, color:'var(--adm-text-hint)' }}>.jpg · .png · .webp</span>
              </div>
            )}
          </div>

          {/* Preview miniaturas */}
          {imgFiles.length > 0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
              {[...imgFiles].slice(0,8).map((f,i) => (
                <div key={i} style={{ borderRadius:8, overflow:'hidden', border:'1px solid var(--adm-border)' }}>
                  <img src={URL.createObjectURL(f)} alt={f.name} style={{ width:'100%', height:60, objectFit:'cover', display:'block' }} />
                  <div style={{ fontSize:9, padding:'3px 5px', color:'var(--adm-text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {f.name.replace(/\.[^.]+$/,'')}
                  </div>
                </div>
              ))}
              {imgFiles.length > 8 && (
                <div style={{ height:60, background:'var(--adm-bg)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'var(--adm-text-muted)', borderRadius:8 }}>
                  +{imgFiles.length-8}
                </div>
              )}
            </div>
          )}

          {imgErr && (
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--adm-err-bg)', color:'var(--adm-err-text)', padding:'10px 14px', borderRadius:10, fontSize:13, fontWeight:500 }}>
              <i className="ti ti-alert-circle" />{imgErr}
            </div>
          )}

          {imgResult && (
            <div style={{ background:'var(--adm-ok-bg)', borderRadius:10, padding:'12px 14px', display:'flex', flexDirection:'column', gap:6 }}>
              {[['✅ Subidas',imgResult.subidas??'—'],['⚠️ Errores',imgResult.errores??0],['❓ No encontrados',imgResult.noEncontrados??0]].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--adm-ok-text)' }}>
                  <span>{l}</span><strong>{v}</strong>
                </div>
              ))}
            </div>
          )}

          <button className="adm-btn" style={{ background:'#1565C0', color:'#fff', justifyContent:'center', padding:12 }}
            onClick={handleImgs} disabled={!imgFiles.length || loadingImg}>
            {loadingImg ? <><i className="ti ti-loader-2 adm-spin" /> Subiendo…</> : <><i className="ti ti-cloud-upload" /> Subir imágenes</>}
          </button>
        </div>
      </div>

      {/* Info endpoints */}
      <div className="adm-card">
        <div className="adm-card-header">
          <span className="adm-card-title"><i className="ti ti-info-circle" style={{ color:'var(--adm-teal)', marginRight:8 }} />Endpoints (Postman / API)</span>
        </div>
        <div style={{ padding:'14px 18px', display:'flex', flexDirection:'column', gap:10 }}>
          {[
            ['POST','/api/admin/importar/productos','form-data · key: archivo (File)'],
            ['POST','/api/admin/importar/imagenes','form-data · key: archivos (File, múltiples)'],
          ].map(([m,url,desc]) => (
            <div key={url} style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <span style={{ padding:'2px 8px', borderRadius:4, fontSize:11, fontWeight:800, background:'var(--adm-info-bg)', color:'var(--adm-info-text)' }}>{m}</span>
              <code style={{ background:'var(--adm-bg)', padding:'3px 10px', borderRadius:6, fontSize:12, color:'var(--adm-teal-dark)', fontWeight:600 }}>{url}</code>
              <span style={{ fontSize:12, color:'var(--adm-text-muted)' }}>{desc}</span>
            </div>
          ))}
          <div style={{ fontSize:12, color:'var(--adm-text-muted)', marginTop:4 }}>
            <i className="ti ti-lock" style={{ marginRight:6 }} />
            Requiere header: <code style={{ background:'var(--adm-bg)', padding:'2px 8px', borderRadius:5, fontSize:11 }}>Authorization: Bearer &lt;token&gt;</code>
          </div>
        </div>
      </div>
    </div>
  )
}
