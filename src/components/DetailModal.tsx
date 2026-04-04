import { useState, useEffect } from 'react'
import { WINE_ICONS, TIPO_COLORS, PRICE_RANGES } from '../data/wines'
import { useWineData } from '../context/WineContext'

export default function DetailModal({ item, type, onClose, onUpdate }) {
  const { updateVino, updateChampagne, deleteVino, deleteChampagne } = useWineData()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ ...item })

  useEffect(() => {
    setForm({ ...item })
  }, [item])

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
        { k: 'variedad', l: 'Variedad' },
        { k: 'region', l: 'Origen/Region' },
        { k: 'precio', l: 'Rango precio', sel: ['', ...PRICE_RANGES] },
        { k: 'anadas_probadas', l: 'Anadas probadas' },
        { k: 'anadas_recomendadas', l: 'Anadas recomendadas' },
        { k: 'tier', l: 'Rating', sel: ['', '1', '2', '3', '4', '5'] },
        { k: 'comentarios', l: 'Comentarios', multi: true },
      ]

  async function handleSave() {
    if (isChamp) await updateChampagne(item.id, form)
    else await updateVino(item.id, form)
    if (onUpdate) onUpdate(form)
    setEditing(false)
    onClose()
  }

  async function handleDelete() {
    if (!window.confirm('¿Eliminar este vino?')) return
    if (isChamp) await deleteChampagne(item.id)
    else await deleteVino(item.id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
      style={{ background: '#000000cc', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-8 max-w-[560px] w-full max-h-[85vh] overflow-y-auto relative"
        style={{ background: 'linear-gradient(180deg, ' + c.bg + ', #0d0d14)', border: '1px solid ' + c.accent + '44' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-transparent border-none text-[#666] text-2xl cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-6">
          <span className="text-4xl">{icon}</span>
          <h2 className="text-[22px] font-bold mt-2 mb-1" style={{ color: c.text }}>{title}</h2>
          <p className="text-[#999] text-sm italic">{form.bodega}</p>
        </div>
        <div className="flex flex-col gap-4">
          {fields.map(f => (
            <div key={f.k}>
              <label className="text-[11px] uppercase tracking-wider block mb-1" style={{ color: c.accent }}>
                {f.l}
              </label>
              {editing ? (
                f.sel ? (
                  <select
                    className="w-full rounded-lg p-2.5 text-sm outline-none text-[#e8e0d5]"
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
                    className="w-full rounded-lg p-2.5 text-sm outline-none text-[#e8e0d5] resize-y"
                    style={{ background: '#ffffff0a', border: '1px solid ' + c.accent + '33' }}
                    rows={3}
                    value={form[f.k] || ''}
                    onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                  />
                ) : (
                  <input
                    className="w-full rounded-lg p-2.5 text-sm outline-none text-[#e8e0d5]"
                    style={{ background: '#ffffff0a', border: '1px solid ' + c.accent + '33' }}
                    value={form[f.k] || ''}
                    onChange={e => setForm({ ...form, [f.k]: e.target.value })}
                  />
                )
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: c.text }}>
                  {f.k === 'tier' && form[f.k] ? form[f.k] + '/5 ' + '★'.repeat(Number(form[f.k])) : (form[f.k] || '—')}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 mt-7 pt-5" style={{ borderTop: '1px solid ' + c.accent + '22' }}>
          {editing ? (
            <>
              <button
                className="flex-1 py-3 border-none rounded-lg font-semibold cursor-pointer text-[13px] text-white"
                style={{ background: c.accent }}
                onClick={handleSave}
              >
                Guardar
              </button>
              <button
                className="flex-1 py-3 rounded-lg font-semibold cursor-pointer text-[13px] text-[#aaa]"
                style={{ background: '#ffffff0a' }}
                onClick={() => { setForm({ ...item }); setEditing(false) }}
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                className="flex-1 py-3 rounded-lg font-semibold cursor-pointer text-[13px]"
                style={{ background: c.accent + '22', border: '1px solid ' + c.accent + '44', color: c.accent }}
                onClick={() => setEditing(true)}
              >
                ✏️ Editar
              </button>
              <button
                className="py-3 px-5 rounded-lg font-semibold cursor-pointer text-[13px] text-[#ff4d4f]"
                style={{ background: '#ff4d4f11', border: '1px solid #ff4d4f33' }}
                onClick={handleDelete}
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
