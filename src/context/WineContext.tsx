import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const WineContext = createContext(null)

export function WineProvider({ children }) {
  const [vinos, setVinos] = useState([])
  const [champagnes, setChampagnes] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchVinos() {
    const { data } = await supabase.from('vinos').select('*').order('bodega')
    setVinos(data || [])
  }

  async function fetchChampagnes() {
    const { data } = await supabase.from('champagnes').select('*').order('vino')
    setChampagnes(data || [])
  }

  useEffect(() => {
    async function fetchData() {
      await Promise.all([fetchVinos(), fetchChampagnes()])
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

  async function addChampagne(form) {
    const { id: _, ...formWithoutId } = form
    await supabase.from('champagnes').insert([formWithoutId])
    await fetchChampagnes()
  }

  async function updateChampagne(id, form) {
    const { id: _, ...formWithoutId } = form
    await supabase.from('champagnes').update(formWithoutId).eq('id', id)
    await fetchChampagnes()
  }

  async function deleteChampagne(id) {
    await supabase.from('champagnes').delete().eq('id', id)
    await fetchChampagnes()
  }

  return (
    <WineContext.Provider value={{
      data: { vinos, champagnes },
      loading,
      addVino, updateVino, deleteVino,
      addChampagne, updateChampagne, deleteChampagne
    }}>
      {children}
    </WineContext.Provider>
  )
}

export function useWineData() {
  return useContext(WineContext)
}
