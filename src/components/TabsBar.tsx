import { useWineData } from '../context/WineContext'
import { exportToExcel } from '../utils/exportExcel'

export default function TabsBar({ onAdd }) {
  const { data } = useWineData()

  return (
    <div className="flex items-center gap-0 mb-6" style={{ borderBottom: '1px solid #ffffff11' }}>
      <span className="px-6 py-3 border-b-2 border-[#C4A942] font-semibold text-sm text-[#e8e0d5]">
        🍷 Vinos <span className="text-[11px] opacity-60">({data.vinos.length})</span>
      </span>
      <div className="flex-1" />
      <button
        onClick={() => exportToExcel(data)}
        className="px-4 py-2 rounded-lg font-semibold cursor-pointer text-[13px] mb-2 mr-2 transition-opacity hover:opacity-80"
        style={{ background: '#ffffff0a', border: '1px solid #ffffff22', color: '#C4A942' }}
      >
        📥 Excel
      </button>
      <button
        onClick={onAdd}
        className="px-5 py-2 border-none rounded-lg text-white font-semibold cursor-pointer text-[13px] mb-2"
        style={{ background: 'linear-gradient(135deg, #8B2252, #C4A942)' }}
      >
        + Añadir
      </button>
    </div>
  )
}