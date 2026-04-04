import { useState } from 'react'
import { useWineData } from '../context/WineContext'
import { PRICE_RANGES } from '../data/wines'

export default function AddModal({ onClose }) {
  const { addVino } = useWineData()

  const [form, setForm] = useState({
    marca: '', bodega: '', tipo: 'Tinto', grado: '', variedad: '',
    region: '', precio: '', anadas_probadas: '', anadas_recomendadas: '',
    tier: '', comentarios: ''
  })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  async function handleSubmit() {
    if (!form.marca || !form.bodega) { alert('Marca y bodega son obligatorios'); return }
    await addVino(form)
    onClose()
  }

  const fields = [
    { k: 'marca', l: 'Marca *' },
    { k: 'bodega', l: 'Bodega/Productor *' },
    { k: 'tipo', l: 'Tipo', sel: ['Tinto', 'Blanco', 'Blanco dulce', 'Dulce', 'Generoso', 'Manzanilla', 'Champagne'] },
    { k: 'grado', l: 'Grado (%)', type: 'number' },
    { k: 'variedad', l: 'Variedad' },
    { k: 'region', l: 'Origen/Region' },
    { k: 'precio', l: 'Rango precio', sel: ['', ...PRICE_RANGES] },
    { k: 'anadas_probadas', l: 'Anadas probadas' },
    { k: 'anadas_recomendadas', l: 'Anadas recomendadas' },
    { k: 'tier', l: 'Rating', sel: ['', '1', '2', '3', '4', '5'] },
    { k: 'comentarios', l: 'Comentarios', multi: true },
  ]

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
      style={{ background: '#000000cc', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-8 max-w-[560px] w-full max-h-[85vh] overflow-y-auto"
        style={{ background: 'linear-gradient(180deg, #1a1a2e, #0d0d14)', border: '1px solid #ffffff22' }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl text-[#e8e0d5] mb-6 font-bold">🍷 Nuevo Vino</h2>
        <div className="flex flex-col gap-4">
          {fields.map(f => (
            <div key={f.k}>
              <label className="text-[11px] uppercase tracking-wider block mb-1" style={{ color: '#8B2252' }}>
                {f.l}
              </label>
              {f.sel ? (
                <select
                  className="w-full rounded-lg p-2.5 text-sm outline-none text-[#e8e0d5]"
                  style={{ background: '#ffffff0a', border: '1px solid #8B225233' }}
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
                  className="w-full rounded-lg p-2.5 text-sm outline-none text-[#e8e0d5] resize-y"
                  style={{ background: '#ffffff0a', border: '1px solid #8B225233' }}
                  rows={3}
                  value={form[f.k]}
                  onChange={e => set(f.k, e.target.value)}
                />
              ) : (
                <input
                  className="w-full rounded-lg p-2.5 text-sm outline-none text-[#e8e0d5]"
                  style={{ background: '#ffffff0a', border: '1px solid #8B225233' }}
                  type={f.type || 'text'}
                  step={f.type === 'number' ? '0.1' : undefined}
                  value={form[f.k]}
                  onChange={e => set(f.k, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2.5 mt-6">
          <button
            className="flex-1 py-3 border-none rounded-lg font-semibold cursor-pointer text-[13px] text-white"
            style={{ background: '#8B2252' }}
            onClick={handleSubmit}
          >
            Añadir
          </button>
          <button
            className="flex-1 py-3 rounded-lg font-semibold cursor-pointer text-[13px] text-[#aaa]"
            style={{ background: '#ffffff0a' }}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}