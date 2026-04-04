const c = TIPO_COLORS[wine.tipo] || TIPO_COLORS['Tinto']
  const icon = WINE_ICONS[wine.tipo] || '🍷'

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

      <div className="flex flex-col gap-1 mt-2">
        {wine.tier && (
          <span className="text-[11px] font-semibold" style={{ color: '#C4A942' }}>
            {'★'.repeat(Number(wine.tier))}{'☆'.repeat(5 - Number(wine.tier))} {wine.tier}/5
          </span>
        )}
        {wine.anadas_probadas && (
          <span className="text-[10px] text-[#888]">
            🗓 {wine.anadas_probadas}
          </span>
        )}
      </div>
    </div>
  )