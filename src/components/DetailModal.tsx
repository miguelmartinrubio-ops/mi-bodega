import { useState, useEffect } from 'react'
import { WINE_ICONS, TIPO_COLORS, PRICE_RANGES } from '../data/wines'
import { useWineData } from '../context/WineContext'
import { formatVariedad } from '../utils/formatVariedad'
import { supabase } from '../lib/supabase'

interface Toma {
  id: string
  vino_id: number
  fecha: string
  lugar: string | null
}

export default function DetailModal({ item, type, onClose, onUpdate }) {
  const { updateVino, updateChampagne, deleteVino, deleteChampagne, fetchTomas, addToma, deleteToma } = useWineData()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...item })

  // Tomas
  const [tomasOpen, setTomasOpen] = useState(false)
  const [tomas, setTomas] = useState<Toma[]>([])
  const [tomasLoading, setTomasLoading] = useState(false)
  const [nuevaFecha, setNuevaFecha] = useState(new Date().toISOString().split('T')[0])
  const [nuevaLugar, setNuevaLugar] = useState('')
  const [savingToma, setSavingToma] = useState(false)

  // Autocomplete lugares
  const [sugerencias, setSugerencias] = useState<string[]>([])
  const [showSugerencias, setShowSugerencias] = useState(false)

  useEffect(() => { setForm({ ...item }) }, [item])

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    if (tomasOpen && type === 'vino') loadTomas()
  }, [tomasOpen])

  async function loadTomas() {
    setTomasLoading(true)
    const data = await fetchTomas(item.id)
    setTomas(data)
    setTomasLoading(false)
  }

  async function fetchLugares(query: string) {
    if (!query) { setSugerencias([]); setShowSugerencias(false); return }
    const { data } = await supabase
      .from('tomas')
      .select('lugar')
      .ilike('lugar', `%${query}%`)
      .not('lugar', 'is', null)
    const unicos = [...new Set((data || []).map((t: any) => t.lugar))] as string[]
    setSugerencias(unicos)
    setShowSugerencias(unicos.length > 0)
  }

  async function handleAddToma() {
    if (!nuevaFecha) return
    setSavingToma(true)
    await addToma(item.id, nuevaFecha, nuevaLugar)
    await loadTomas()
    setNuevaLugar('')
    setNuevaFecha(new Date().toISOString().split('T')[0])
    setSavingToma(false)
  }

  async function handleDeleteToma(tomaId: string) {
    await deleteToma(tomaId)
    await loadTomas()
  }

  if (!item) return null

  const isChamp = type === 'champagne'
  const c = TIPO_COLORS[item.tipo] || TIPO_COLORS['Champagne']
  const icon = isChamp ? '🍾' : (WINE_ICONS[item.tipo] || '🍷')
  const title = isChamp ? item.vino : item.marca

  const fields = isChamp
    ? [
        { k: 'vino', l: 'Vino' },
        { k: 'bodega', l: 'Bodega' },
        { k: 'variedad', l: 'Variedad' },
        { k: 'zona', l: 'Zona' },
        { k: 'precio', l: 'Precio' },
        { k: 'lugar', l: 'Lugar' },
        { k: 'fecha', l: 'Fecha' },
      ]
    : [
        { k: 'marca', l: 'Marca' },
        { k: 'bodega', l: 'Bodega/Productor' },
        { k: 'tipo', l: 'Tipo', sel: ['Tinto', 'Blanco', 'Blanco dulce', 'Dulce', 'Generoso', 'Manzanilla', 'Champagne'] },
        { k: 'grado', l: 'Grado (%)' },
        { k: 'variedad', l: 'Variedad', hint: 'Ej: 80% Tempranillo / 20% Garnacha' },
        { k: 'region', l: 'Origen/Region' },
        { k: 'precio', l: 'Rango precio', sel: ['', ...PRICE_RANGES] },
        { k: 'anadas_probadas', l: 'Anadas probadas' },
        { k: 'anadas_recomendadas', l: 'Anadas recomendadas' },
        { k: 'tier', l: 'Rating', sel: ['', '1', '2', '3', '4', '5'] },
        { k: 'comentarios', l: 'Comentarios', multi: true, full: true },
      ]

  async function handleSave() {
    const formFormatted = { ...form, variedad: formatVariedad(form.variedad) }
    if (isChamp) await updateChampagne(item.id, formFormatted)
    else await updateVino(item.id, formFormatted)
    if (onUpdate) onUpdate(formFormatted)
    setEditing(false)
    onClose()
  }

  async function handleDelete() {
    if (!window.confirm('¿Eliminar este vino?')) return
    if (isChamp) await deleteChampagne(item.id)
    else await deleteVino(item.id)
    onClose()
  }

  const formatFecha = (fecha: string) =>
    new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric'
    })

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
      style={{ background: '#000000cc', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 w-full max-h-[90vh] overflow-y-auto relative"
        style={{
          background: 'linear-gradient(180deg, ' + c.bg + ', #0d0d14)',
          border: '1px solid ' + c.accent + '44',
          maxWidth: '800px'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <div>
              <h2 className="text-[18px] font-bold leading-tight" style={{ color: c.text }}>{title}</h2>
              <p className="text-[#999] text-xs italic">{form.bodega}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button
                  className="px-4 py-2 border-none rounded-lg font-semibold cursor-pointer text-[13px] text-white"
                  style={{ background: c.accent }}
                  onClick={handleSave}
                >
                  💾 Guardar
                </button>
                <button
                  className="px-4 py-2 rounded-lg font-semibold cursor-pointer text-[13px] text-[#aaa]"
                  style={{ background: '#ffffff0a' }}
                  onClick={() => { setForm({ ...item }); setEditing(false) }}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  className="px-4 py-2 rounded-lg font-semibold cursor-pointer text-[13px]"
                  style={{ background: c.accent + '22', border: '1px solid ' + c.accent + '44', color: c.accent }}
                  onClick={() => setEditing(true)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="px-3 py-2 rounded-lg font-semibold cursor-pointer text-[13px] text-[#ff4d4f]"
                  style={{ background: '#ff4d4f11', border: '1px solid #ff4d4f33' }}
                  onClick={handleDelete}
                >
                  🗑️
                </button>
              </>
            )}
            <button
              className="px-3 py-2 bg-transparent border-none text-[#666] text-xl cursor-pointer"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        {/* Fields grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {fields.map(f => (
            <div key={f.k} style={{ gridColumn: f.full ? '1 / -1' : 'auto' }}>
              <label className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: c.accent }}>
                {f.l}
              </label>
              {editing ? (
                f.sel ? (
                  <select
                    className="w-full rounded-lg p-2 text-sm outline-none text-[#e8e0d5]"
                    style={{ background: '#ffffff0a', border: '1px solid ' + c.accent + '33' }}
                    value={form[f.k] || ''}
                    onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                  >
                    {f.sel.map(o => (
                      <option key={o} value={o} style={{ background: '#1a1a2e' }}>
                        {o ? (f.k === 'tier' ? o + '/5 ' + '★'.repeat(Number(o)) : o) : '— Seleccionar —'}
                      </option>
                    ))}
                  </select>
                ) : f.multi ? (
                  <textarea
                    className="w-full rounded-lg p-2 text-sm outline-none text-[#e8e0d5] resize-y"
                    style={{ background: '#ffffff0a', border: '1px solid ' + c.accent + '33' }}
                    rows={2}
                    value={form[f.k] || ''}
                    onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                  />
                ) : (
                  <>
                    <input
                      className="w-full rounded-lg p-2 text-sm outline-none text-[#e8e0d5]"
                      style={{ background: '#ffffff0a', border: '1px solid ' + c.accent + '33' }}
                      placeholder={f.hint || ''}
                      value={form[f.k] || ''}
                      onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                    />
                    {f.hint && (
                      <p className="text-[9px] mt-0.5" style={{ color: c.accent + '99' }}>{f.hint}</p>
                    )}
                  </>
                )
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: c.text }}>
                  {f.k === 'tier' && form[f.k] ? form[f.k] + '/5 ' + '★'.repeat(Number(form[f.k])) : (form[f.k] || '—')}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Historial de catas — solo para vinos */}
        {type === 'vino' && (
          <div className="mt-6" style={{ borderTop: '1px solid ' + c.accent + '22' }}>
            <button
              className="w-full flex items-center justify-between py-3 bg-transparent border-none cursor-pointer text-left"
              onClick={() => setTomasOpen(!tomasOpen)}
            >
              <span className="text-[12px] uppercase tracking-wider font-semibold" style={{ color: c.accent }}>
                🍷 Historial de catas {tomas.length > 0 && !tomasLoading ? `(${tomas.length})` : ''}
              </span>
              <span className="text-[#666] text-sm">{tomasOpen ? '▲' : '▼'}</span>
            </button>

            {tomasOpen && (
              <div className="pb-2">
                {/* Formulario nueva cata */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <input
                    type="date"
                    className="rounded-lg p-2 text-sm outline-none text-[#e8e0d5] flex-1 min-w-[130px]"
                    style={{ background: '#ffffff0a', border: '1px solid ' + c.accent + '33' }}
                    value={nuevaFecha}
                    onChange={e => setNuevaFecha(e.target.value)}
                  />
                  {/* Input lugar con autocomplete */}
                  <div className="relative flex-[2] min-w-[160px]">
                    <input
                      type="text"
                      placeholder="Lugar (restaurante, casa...)"
                      className="w-full rounded-lg p-2 text-sm outline-none text-[#e8e0d5]"
                      style={{ background: '#ffffff0a', border: '1px solid ' + c.accent + '33' }}
                      value={nuevaLugar}
                      onChange={e => {
                        setNuevaLugar(e.target.value)
                        fetchLugares(e.target.value)
                      }}
                      onFocus={() => nuevaLugar && fetchLugares(nuevaLugar)}
                      onBlur={() => setTimeout(() => setShowSugerencias(false), 150)}
                    />
                    {showSugerencias && (
                      <div
                        className="absolute z-20 w-full mt-1 rounded-lg overflow-hidden"
                        style={{ background: '#1a1a2e', border: '1px solid ' + c.accent + '33' }}
                      >
                        {sugerencias.map(lugar => (
                          <button
                            key={lugar}
                            className="w-full text-left px-3 py-2 text-sm text-[#e8e0d5] transition-opacity hover:opacity-70"
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                            onClick={() => {
                              setNuevaLugar(lugar)
                              setShowSugerencias(false)
                            }}
                          >
                            📍 {lugar}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg font-semibold cursor-pointer text-[13px] text-white whitespace-nowrap"
                    style={{ background: c.accent, opacity: savingToma ? 0.6 : 1 }}
                    onClick={handleAddToma}
                    disabled={savingToma}
                  >
                    {savingToma ? '...' : '+ Añadir'}
                  </button>
                </div>

                {/* Lista de catas */}
                {tomasLoading ? (
                  <p className="text-[#666] text-sm">Cargando...</p>
                ) : tomas.length === 0 ? (
                  <p className="text-[#555] text-sm italic">Aún no hay catas registradas.</p>
                ) : (
                  <div className="space-y-2">
                    {tomas.map(toma => (
                      <div
                        key={toma.id}
                        className="flex items-center justify-between rounded-lg px-3 py-2"
                        style={{ background: '#ffffff07', border: '1px solid ' + c.accent + '18' }}
                      >
                        <div className="flex items-center gap-3 text-sm">
                          <span style={{ color: c.accent }}>🍷</span>
                          <span className="text-[#ccc]">{formatFecha(toma.fecha)}</span>
                          {toma.lugar && (
                            <span className="text-[#888]">· 📍 {toma.lugar}</span>
                          )}
                        </div>
                        <button
                          className="text-[#ff4d4f55] hover:text-[#ff4d4f] text-xs bg-transparent border-none cursor-pointer transition-colors"
                          onClick={() => handleDeleteToma(toma.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
