import { useState } from 'react'
import { useWineData } from '../context/WineContext'
import WineCard from '../components/WineCard'
import DetailModal from '../components/DetailModal'

export default function ChampagnePage() {
  const { data, loading } = useWineData()
  const [selected, setSelected] = useState(null)

  if (loading) return <div className="text-center text-[#666] py-20">Cargando...</div>

  return (
    <>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {data.champagnes.map(champ => (
          <WineCard key={champ.id} wine={champ} isChampagne onClick={() => setSelected(champ)} />
        ))}
      </div>
      {data.champagnes.length === 0 && (
        <p className="text-center text-[#666] py-20">No hay champagnes todavía</p>
      )}
      {selected && (
        <DetailModal item={selected} type="champagne" onClose={() => setSelected(null)} />
      )}
    </>
  )
}