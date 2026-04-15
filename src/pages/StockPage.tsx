import { useState } from 'react'
import { useWineData } from '../context/WineContext'
import { WINE_ICONS, TIPO_COLORS } from '../data/wines'

export default function StockPage() {
  const { data, updateStock } = useWineData()
  const [search, setSearch] = useState('')

  const filtered = [...data.vinos]
    .filter(v =>
      !search ||
      v.marca?.toLowerCase().includes(search.toLowerCase()) ||
      v.bodega?.toLowerCase().includes(search.toLowerCase()) ||
      v.tipo?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      // Primero los que tienen stock > 0, luego alfabético
      const stockDiff = (b.stock || 0) - (a.stock || 0)
      if (stockDiff !== 0) return stockDiff
      return (a.marca || '').localeCompare(b.marca || '')
    })

  const total = data.vinos.reduce((sum, v) => sum + (v.stock || 0), 0)
  const vinosConStock = data.vinos.filter(v => (v.stock || 0) > 0).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Resumen */}
      <div
        className="flex items-center justify-between px-5 py-3 rounded-xl mb-4"
        style={{ background: '#ffffff08', border: '1px solid #ffffff12' }}
      >
        <div>
          <p className="text-xs text-[#666]">Total en bodega</p>
          <p className="text-lg font-bold" style={{ color: '#C4A942' }}>
            {total} {total === 1 ? 'botella' : 'botellas'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#666]">Referencias</p>
          <p className="text-lg font-bold" style={{ color: '#C4A942' }}>{vinosConStock}</p>
        </div>
      </div>

      {/* Buscador */}
      <input
        className="w-full rounded-xl px-4 py-3 text-sm outline-none text-[#e8e0d5] mb-4"
        style={{ background: '#ffffff08', border: '1px solid #ffffff15' }}
        placeholder="🔍 Buscar por marca, bodega o tipo..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Lista */}
      <div className="space-y-2">
        {filtered.map(wine => {
          const c = TIPO_COLORS[wine.tipo] || TIPO_COLORS['Tinto']
          const icon = WINE_ICONS[wine.tipo] || '🍷'
          const stock = wine.stock || 0
          const hasStock = stock > 0

          return (
            <div
              key={wine.id}
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all"
              style={{
                background: hasStock ? '#ffffff0d' : '#ffffff05',
                border: '1px solid ' + (hasStock ? c.accent + '33' : '#ffffff0a'),
              }}
            >
              <span className="text-lg" style={{ opacity: hasStock ? 1 : 0.4 }}>{icon}</span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-semibold truncate"
                  style={{ color: hasStock ? '#e8e0d5' : '#666' }}
                >
                  {wine.marca}
                </p>
                <p className="text-xs text-[#555] truncate">{wine.bodega} · {wine.tipo}</p>
              </div>
              {wine.precio && hasStock && (
                <span className="text-[11px] hidden sm:block" style={{ color: c.accent }}>
                  {wine.precio}
                </span>
              )}
              {/* Stock control */}
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-1.5"
                style={{ background: '#ffffff0a', border: '1px solid #ffffff15' }}
              >
                <button
                  className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-70"
                  style={{ background: c.accent + '33', color: c.accent }}
                  onClick={() => updateStock(wine.id, Math.max(0, stock - 1))}
                >
                  −
                </button>
                <span
                  className="text-sm font-bold min-w-[20px] text-center"
                  style={{ color: hasStock ? c.accent : '#444' }}
                >
                  {stock}
                </span>
                <button
                  className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-70"
                  style={{ background: c.accent + '33', color: c.accent }}
                  onClick={() => updateStock(wine.id, stock + 1)}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
