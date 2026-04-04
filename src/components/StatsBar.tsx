import { useMemo } from 'react'
import { useWineData } from '../context/WineContext'

export default function StatsBar() {
  const { data } = useWineData()

  const stats = useMemo(() => {
    const tipos = {}
    data.vinos.forEach(v => { tipos[v.tipo] = (tipos[v.tipo] || 0) + 1 })
    const regiones = new Set(data.vinos.map(v => v.region).filter(Boolean))
    return [
      { label: 'Total vinos', value: data.vinos.length, icon: '🍷' },
      { label: 'Regiones', value: regiones.size, icon: '🗺️' },
      { label: 'Tintos', value: tipos['Tinto'] || 0, icon: '🔴' },
      { label: 'Blancos', value: (tipos['Blanco'] || 0) + (tipos['Blanco dulce'] || 0), icon: '⚪' },
        ]
  }, [data])

  return (
    <div className="grid gap-3 mb-7" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
      {stats.map(s => (
        <div
          key={s.label}
          className="rounded-xl p-4 text-center"
          style={{ background: '#ffffff06', border: '1px solid #ffffff0f' }}
        >
          <div className="text-2xl mb-1">{s.icon}</div>
          <div className="text-[22px] font-bold">{s.value}</div>
          <div className="text-[11px] text-[#666] uppercase tracking-wider">{s.label}</div>
        </div>
      ))}
    </div>
  )
}