import { useState } from 'react'
import { useWineData } from '../context/WineContext'
import WineCard from '../components/WineCard'
import DetailModal from '../components/DetailModal'

export default function VinosPage() {
  const { data, loading } = useWineData()
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('bodega')

  const filtered = data.vinos
    .filter(v =>
      !search ||
      v.marca?.toLowerCase().includes(search.toLowerCase()) ||
      v.bodega?.toLowerCase().includes(search.toLowerCase()) ||
      v.region?.toLowerCase().includes(search.toLowerCase()) ||
      v.tipo?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return (Number(b.tier) || 0) - (Number(a.tier) || 0)
      }
      if (sortBy === 'precio') {
        const order = ['<15€','15-25€','25-40€','40-50€','50-60€','60-80€','80-100€','100-125€','125-150€','150-200€','200-250€','250-300€']
        return order.indexOf(b.precio) - order.indexOf(a.precio)
      }
      if (sortBy === 'tipo') return (a.tipo || '').localeCompare(b.tipo || '')
      return (a.bodega || '').localeCompare(b.bodega || '')
    })

  if (loading) return <div className="text-center text-[#666] py-20">Cargando vinos...</div>

  return (
    <>
      <div className="flex gap-3 mb-6">
        <input
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none text-[#e8e0d5]"
          style={{ background: '#ffffff08', border: '1px solid #ffffff15' }}
          placeholder="🔍 Buscar por marca, bodega, región o tipo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="rounded-xl px-4 py-3 text-sm outline-none text-[#e8e0d5] cursor-pointer"
          style={{ background: '#ffffff08', border: '1px solid #ffffff15' }}
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="bodega" style={{ background: '#1a1a2e' }}>A-Z Bodega</option>
          <option value="rating" style={{ background: '#1a1a2e' }}>⭐ Rating</option>
          <option value="precio" style={{ background: '#1a1a2e' }}>💰 Precio</option>
          <option value="tipo" style={{ background: '#1a1a2e' }}>🍷 Tipo</option>
        </select>
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filtered.map(wine => (
          <WineCard key={wine.id} wine={wine} onClick={() => setSelected(wine)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-[#666] py-20">No se encontraron vinos</p>
      )}
      {selected && (
        <DetailModal item={selected} type="vino" onClose={() => setSelected(null)} />
      )}
    </>
  )
}