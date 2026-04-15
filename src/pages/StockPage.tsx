import { useWineData } from '../context/WineContext'
import { WINE_ICONS, TIPO_COLORS } from '../data/wines'

export default function StockPage() {
  const { data, updateStock } = useWineData()

  const enStock = [...data.vinos]
    .filter(v => (v.stock || 0) > 0)
    .sort((a, b) => (b.stock || 0) - (a.stock || 0))

  const total = enStock.reduce((sum, v) => sum + (v.stock || 0), 0)

  if (enStock.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-4">🍾</p>
        <p className="text-[#555] text-sm italic">No tienes ninguna botella en stock.</p>
        <p className="text-[#444] text-xs mt-1">Usa los botones + en las tarjetas de vino para añadir.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4">
      {/* Resumen */}
      <div
        className="flex items-center justify-between px-5 py-3 rounded-xl mb-6"
        style={{ background: '#ffffff08', border: '1px solid #ffffff12' }}
      >
        <span className="text-sm text-[#888]">Total en bodega</span>
        <span className="text-lg font-bold" style={{ color: '#C4A942' }}>
          {total} {total === 1 ? 'botella' : 'botellas'}
        </span>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {enStock.map(wine => {
          const c = TIPO_COLORS[wine.tipo] || TIPO_COLORS['Tinto']
          const icon = WINE_ICONS[wine.tipo] || '🍷'
          const stock = wine.stock || 0

          return (
            <div
              key={wine.id}
              className="flex items-center gap-4 px-4 py-3 rounded-xl"
              style={{ background: '#ffffff08', border: '1px solid ' + c.accent + '22' }}
            >
              <span className="text-xl">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#e8e0d5] truncate">{wine.marca}</p>
                <p className="text-xs text-[#666] truncate">{wine.bodega} · {wine.tipo}</p>
              </div>
              {wine.precio && (
                <span className="text-[11px] hidden sm:block" style={{ color: c.accent }}>{wine.precio}</span>
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
                <span className="text-sm font-bold min-w-[20px] text-center" style={{ color: c.accent }}>
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
