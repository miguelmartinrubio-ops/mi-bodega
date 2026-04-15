import { useState } from 'react'
import { WINE_ICONS, TIPO_COLORS } from '../data/wines'
import { useWineData } from '../context/WineContext'

export default function WineCard({ wine, onClick, isChampagne = false }) {
  const [hovered, setHovered] = useState(false)
  const { updateStock } = useWineData()

  if (isChampagne) {
    const col = TIPO_COLORS['Champagne']
    return (
      <div
        className="rounded-xl p-5 cursor-pointer transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${col.bg}, #1a1a2e)`,
          border: `1px solid ${hovered ? col.accent + '88' : col.accent + '44'}`,
          boxShadow: hovered ? `0 8px 32px ${col.accent}22` : 'none',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-2xl">🍾</span>
          {wine.fecha && <span className="text-[11px] text-[#999]">{wine.fecha}</span>}
        </div>
        <h3 className="text-[15px] font-bold mb-1 leading-tight" style={{ color: col.text }}>
          {wine.vino}
        </h3>
        <p className="text-xs text-[#999] italic mb-2">{wine.bodega}</p>
        {wine.lugar && (
          <span className="text-[10px] px-2 py-0.5 rounded-full inline-block" style={{ background: col.accent + '22', color: col.accent }}>
            📍 {wine.lugar}
          </span>
        )}
      </div>
    )
  }

  const c = TIPO_COLORS[wine.tipo] || TIPO_COLORS['Tinto']
  const icon = WINE_ICONS[wine.tipo] || '🍷'
  const stock = wine.stock || 0

  function handleStock(e: React.MouseEvent, delta: number) {
    e.stopPropagation()
    const nuevo = Math.max(0, stock + delta)
    updateStock(wine.id, nuevo)
  }

  return (
    <div
      className="rounded-xl p-5 cursor-pointer transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${c.bg}, #1a1a2e)`,
        border: `1px solid ${hovered ? c.accent + '88' : c.accent + '44'}`,
        boxShadow: hovered ? `0 8px 32px ${c.accent}22` : 'none',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-2xl">{icon}</span>
        {wine.precio && (
          <span className="text-[11px] font-semibold" style={{ color: c.accent }}>{wine.precio}</span>
        )}
      </div>
      <h3 className="text-[15px] font-bold mb-1 leading-tight" style={{ color: c.text }}>
        {wine.marca}
      </h3>
      <p className="text-xs text-[#999] italic mb-3">{wine.bodega}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: c.accent + '22', color: c.accent }}>
          {wine.tipo}
        </span>
        {wine.region && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffffff11] text-[#aaa]">{wine.region}</span>
        )}
        {wine.grado && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffffff11] text-[#aaa]">{wine.grado}%</span>
        )}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex flex-col gap-1">
          {wine.tier && (
            <span className="text-[11px] font-semibold" style={{ color: '#C4A942' }}>
              {'★'.repeat(Number(wine.tier))}{'☆'.repeat(5 - Number(wine.tier))} {wine.tier}/5
            </span>
          )}
          {wine.anadas_probadas && (
            <span className="text-[10px] text-[#888]">🗓 {wine.anadas_probadas}</span>
          )}
        </div>
        {/* Stock control */}
        <div
          className="flex items-center gap-1.5 rounded-lg px-2 py-1"
          style={{ background: '#ffffff0a', border: '1px solid #ffffff15' }}
        >
          <button
            className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition-opacity hover:opacity-70"
            style={{ background: c.accent + '33', color: c.accent }}
            onClick={(e) => handleStock(e, -1)}
          >
            −
          </button>
          <span className="text-xs font-semibold min-w-[16px] text-center" style={{ color: stock > 0 ? c.accent : '#555' }}>
            {stock}
          </span>
          <button
            className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold transition-opacity hover:opacity-70"
            style={{ background: c.accent + '33', color: c.accent }}
            onClick={(e) => handleStock(e, +1)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
