import { useState } from 'react'
import { useWineData } from '../context/WineContext'

const COLUMNAS = [
  { id: 'sin_clasificar', label: '➖ Sin clasificar', color: '#666666' },
  { id: 'quiero_pronto', label: '🎯 Quiero probarlo pronto', color: '#C4A942' },
  { id: 'en_lista', label: '📋 En mi lista', color: '#4A90D9' },
  { id: 'repetir_pronto', label: '⭐ Repetir pronto', color: '#C4485A' },
  { id: 'repetir_sin_prisa', label: '🔄 Repetir (sin prisa)', color: '#8B6BAD' },
  { id: 'no_repetir', label: '✅ Probado, no repetir', color: '#4CAF7A' },
]

export default function KanbanPage() {
  const { data, loading, updateEstado } = useWineData()
  const [search, setSearch] = useState('')
  const [moving, setMoving] = useState(null)

  if (loading) return <div className="text-center text-[#666] py-20">Cargando...</div>

  const filtered = data.vinos.filter(v =>
    !search ||
    v.marca?.toLowerCase().includes(search.toLowerCase()) ||
    v.bodega?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleEstado(vino, nuevoEstado) {
    setMoving(vino.id)
    await updateEstado(vino.id, nuevoEstado)
    setMoving(null)
  }

  return (
    <>
      <input
        className="w-full rounded-xl px-4 py-3 mb-6 text-sm outline-none text-[#e8e0d5]"
        style={{ background: '#ffffff08', border: '1px solid #ffffff15' }}
        placeholder="🔍 Buscar por marca o bodega..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="flex gap-4 overflow-x-auto pb-4" style={{ alignItems: 'flex-start' }}>
        {COLUMNAS.map(col => {
          const vinos = filtered.filter(v => (v.estado || 'sin_clasificar') === col.id)
          return (
            <div
              key={col.id}
              className="rounded-xl p-3 flex-shrink-0"
              style={{
                background: '#ffffff06',
                border: '1px solid ' + col.color + '44',
                width: '220px',
                minHeight: '200px'
              }}
            >
              {/* Column header */}
              <div className="mb-3 pb-2" style={{ borderBottom: '1px solid ' + col.color + '44' }}>
                <p className="text-[11px] font-semibold" style={{ color: col.color }}>
                  {col.label}
                </p>
                <p className="text-[10px] text-[#666]">{vinos.length} vinos</p>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2">
                {vinos.map(vino => (
                  <div
                    key={vino.id}
                    className="rounded-lg p-3"
                    style={{
                      background: '#ffffff0a',
                      border: '1px solid ' + col.color + '22',
                      opacity: moving === vino.id ? 0.5 : 1,
                      transition: 'opacity 0.2s'
                    }}
                  >
                    <p className="text-[12px] font-semibold text-[#e8e0d5] mb-0.5 leading-tight">{vino.marca}</p>
                    <p className="text-[10px] text-[#888] italic mb-2">{vino.bodega}</p>
                    {vino.tier && (
                      <p className="text-[10px] mb-2" style={{ color: '#C4A942' }}>
                        {'★'.repeat(Number(vino.tier))}{'☆'.repeat(5 - Number(vino.tier))}
                      </p>
                    )}

                    {/* Move buttons */}
                    <select
                      className="w-full rounded p-1 text-[10px] outline-none cursor-pointer"
                      style={{ background: '#1a1a2e', border: '1px solid ' + col.color + '33', color: col.color }}
                      value={col.id}
                      onChange={e => handleEstado(vino, e.target.value)}
                    >
                      {COLUMNAS.map(c => (
                        <option key={c.id} value={c.id} style={{ background: '#1a1a2e' }}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                {vinos.length === 0 && (
                  <p className="text-[10px] text-[#444] text-center py-4">Sin vinos</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
