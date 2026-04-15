import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const WineContext = createContext(null)

export function WineProvider({ children }) {
  const [vinos, setVinos] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchVinos() {
    const { data } = await supabase.from('vinos').select('*').order('bodega')
    setVinos(data || [])
  }

  useEffect(() => {
    async function fetchData() {
      await fetchVinos()
      setLoading(false)
    }
    fetchData()
  }, [])

  async function addVino(form) {
    const { id: _, ...formWithoutId } = form
    await supabase.from('vinos').insert([formWithoutId])
    await fetchVinos()
  }
  async function updateVino(id, form) {
    const { id: _, ...formWithoutId } = form
    await supabase.from('vinos').update(formWithoutId).eq('id', id)
    await fetchVinos()
  }
  async function deleteVino(id) {
    await supabase.from('vinos').delete().eq('id', id)
    await fetchVinos()
  }
  async function updateEstado(id, estado) {
    await supabase.from('vinos').update({ estado }).eq('id', id)
    await fetchVinos()
  }
  async function updateStock(id: number, stock: number) {
    await supabase.from('vinos').update({ stock }).eq('id', id)
    setVinos(prev => prev.map(v => v.id === id ? { ...v, stock } : v))
  }

  // --- TOMAS ---
  async function fetchTomas(vinoId: number) {
    const { data } = await supabase
      .from('tomas')
      .select('*')
      .eq('vino_id', vinoId)
      .order('fecha', { ascending: false })
    return data || []
  }
  async function addToma(vinoId: number, fecha: string, lugar: string) {
    await supabase.from('tomas').insert([{ vino_id: vinoId, fecha, lugar }])
  }
  async function deleteToma(tomaId: string) {
    await supabase.from('tomas').delete().eq('id', tomaId)
  }

  return (
    <WineContext.Provider value={{
      data: { vinos, champagnes: [] },
      loading,
      addVino, updateVino, deleteVino,
      updateEstado, updateStock,
      fetchTomas, addToma, deleteToma
    }}>
      {children}
    </WineContext.Provider>
  )
}

export function useWineData() {
  return useContext(WineContext)
}
