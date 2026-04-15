import { NavLink } from 'react-router-dom'
import { useWineData } from '../context/WineContext'
import { exportToExcel } from '../utils/exportExcel'

export default function TabsBar({ onAdd }) {
  const { data } = useWineData()
  const totalStock = data.vinos.reduce((sum, v) => sum + (v.stock || 0), 0)

  return (
    <div className="flex items-center gap-0 mb-6" style={{ borderBottom: '1px solid #ffffff11' }}>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `px-6 py-3 bg-transparent border-b-2 font-semibold text-sm cursor-pointer transition-all ${
            isActive ? 'border-[#C4A942] text-[#e8e0d5]' : 'border-transparent text-[#666]'
          }`
        }
      >
        🍷 Vinos <span className="text-[11px] opacity-60">({data.vinos.length})</span>
      </NavLink>
      <NavLink
        to="/kanban"
        className={({ isActive }) =>
          `px-6 py-3 bg-transparent border-b-2 font-semibold text-sm cursor-pointer transition-all ${
            isActive ? 'border-[#C4A942] text-[#e8e0d5]' : 'border-transparent text-[#666]'
          }`
        }
      >
        📋 Kanban
      </NavLink>
      <NavLink
        to="/timeline"
        className={({ isActive }) =>
          `px-6 py-3 bg-transparent border-b-2 font-semibold text-sm cursor-pointer transition-all ${
            isActive ? 'border-[#C4A942] text-[#e8e0d5]' : 'border-transparent text-[#666]'
          }`
        }
      >
        📅 Timeline
      </NavLink>
      <NavLink
        to="/stock"
        className={({ isActive }) =>
          `px-6 py-3 bg-transparent border-b-2 font-semibold text-sm cursor-pointer transition-all ${
            isActive ? 'border-[#C4A942] text-[#e8e0d5]' : 'border-transparent text-[#666]'
          }`
        }
      >
        🍾 Stock {totalStock > 0 && <span className="text-[11px] opacity-60">({totalStock})</span>}
      </NavLink>
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
