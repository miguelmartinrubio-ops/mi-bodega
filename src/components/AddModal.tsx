import { useState, useEffect } from 'react'
import { useWineData } from '../context/WineContext'
import { PRICE_RANGES } from '../data/wines'
import { formatVariedad } from '../utils/formatVariedad'

export default function AddModal({ onClose }) {
  const { addVino } = useWineData()

  const [form, setForm] = useState({
    marca: '', bodega: '', tipo: 'Tinto', grado: '', variedad: '',
    region: '', precio: '', anadas_probadas: '', anadas_recomendadas: '',
    tier: '', comentarios: ''
  })

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  async function handleSubmit() {
    if (!form.marca || !form.bodega) { alert('Marca y bodega son obligatorios'); return }
    await addVino({ ...form, variedad: formatVariedad(form.variedad) })
    onClose()
  }

  const fields = [
    { k: 'marca', l: 'Marca *' },
    { k: 'bodega', l: 'Bodega/Productor *' },
    { k: 'tipo', l: 'Tipo', sel: ['Tinto', 'Blanco', 'Blanco dulce', 'Dulce', 'Generoso', 'Manzanilla', 'Champagne'] },
    { k: 'grado', l: 'Grado (%)', type: 'number' },
    { k: 'variedad', l: 'Variedad', hint: 'Ej: 80% Tempranillo / 20% Garnacha' },
    { k: 'region', l: 'Origen/Region' },
    { k: 'precio', l: 'Rango precio', sel: ['', ...PRICE_RANGES] },
    { k: 'anadas_probadas', l: 'Anadas probadas' },
    { k: 'anadas_recomendadas', l: 'Anadas recomendadas' },
    { k: 'tier', l: 'Rating', sel: ['', '1', '2', '3', '4', '5'] },
    { k: 'comentarios', l: 'Comentarios', multi: true, full: true },
  ]

  const accent = '#8B2252'

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
      style={{ background: '#000000cc', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-6 w-full max-h-[90vh] overflow-y-auto relative"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e, #0d0d14)',
          border: '1px solid #ffffff22',
          maxWidth: '800px'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍷</span>
            <div>
              <h2 className="text-[18px] font-bold text-[#e8e0d5]">Nuevo Vino</h2>
              <p className="text-[#999] text-xs">Rellena los campos y guarda</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 border-none rounded-lg font-semibold cursor-pointer text-[13px] text-white"
              style={{ background: accent }}
              onClick={handleSubmit}
            >
              💾 Añadir
            </button>
            <button
              className="px-4 py-2 rounded-lg font-semibold cursor-pointer text-[13px] text-[#aaa]"
              style={{ background: '#ffffff0a' }}
              onClick={onClose}
            >
              Cancelar
            </button>
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
              <label className="text-[10px] uppercase tracking-wider block mb-1" style={{ color: accent }}>
                {f.l}
              </label>
              {f.sel ? (
                <select
                  className="w-full rounded-lg p-2 text-sm outline-none text-[#e8e0d5]"
                  style={{ background: '#ffffff0a', border: '1px solid ' + accent + '33' }}
                  value={form[f.k]}
                  onChange={e => set(f.k, e.target.value)}
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
                  style={{ background: '#ffffff0a', border: '1px solid ' + accent + '33' }}
                  rows={2}
                  value={form[f.k]}
                  onChange={e => set(f.k, e.target.value)}
                />
              ) : (
                <>
                  <input
                    className="w-full rounded-lg p-2 text-sm outline-none text-[#e8e0d5]"
                    style={{ background: '#ffffff0a', border: '1px solid ' + accent + '33' }}
                    type={f.type || 'text'}
                    step={f.type === 'number' ? '0.1' : undefined}
                    placeholder={f.hint || ''}
                    value={form[f.k]}
                    onChange={e => set(f.k, e.target.value)}
                  />
                  {f.hint && (
                    <p className="text-[9px] mt-0.5" style={{ color: accent + '99' }}>{f.hint}</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
