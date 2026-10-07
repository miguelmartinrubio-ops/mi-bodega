import { createContext, useContext, useEffect, useState } from 'react'
import { turso, query, pickVinoFields } from '../lib/turso'

const WineContext = createContext(null)

export function WineProvider({ children }) {
  const [vinos, setVinos] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchVinos() {
    const data = await query('SELECT * FROM vinos ORDER BY bodega')
    setVinos(data)
  }

  useEffect(() => {
    async function fetchData() {
      await fetchVinos()
      setLoading(false)
    }
    fetchData()
  }, [])

  async function addVino(form) {
    const fields = pickVinoFields(form)
    await turso.execute({
      sql: `INSERT INTO vinos (${fields.map(([c]) => c).join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`,
      args: fields.map(([, v]) => v),
    })
    await fetchVinos()
  }
  async function updateVino(id, form) {
    const fields = pickVinoFields(form)
    if (fields.length === 0) return
    await turso.execute({
      sql: `UPDATE vinos SET ${fields.map(([c]) => `${c} = ?`).join(', ')} WHERE id = ?`,
      args: [...fields.map(([, v]) => v), id],
    })
    await fetchVinos()
  }
  async function deleteVino(id) {
    await turso.batch([
      { sql: 'DELETE FROM tomas WHERE vino_id = ?', args: [id] },
      { sql: 'DELETE FROM vinos WHERE id = ?', args: [id] },
    ], 'write')
    await fetchVinos()
  }
  async function updateEstado(id, estado) {
    await turso.execute({ sql: 'UPDATE vinos SET estado = ? WHERE id = ?', args: [estado, id] })
    await fetchVinos()
  }
  async function updateStock(id: number, stock: number) {
    await turso.execute({ sql: 'UPDATE vinos SET stock = ? WHERE id = ?', args: [stock, id] })
    setVinos(prev => prev.map(v => v.id === id ? { ...v, stock } : v))
  }

  // --- TOMAS ---
  async function fetchTomas(vinoId: number) {
    return query('SELECT * FROM tomas WHERE vino_id = ? ORDER BY fecha DESC', [vinoId])
  }
  async function addToma(vinoId: number, fecha: string, lugar: string) {
    await turso.execute({
      sql: 'INSERT INTO tomas (id, vino_id, fecha, lugar) VALUES (?, ?, ?, ?)',
      args: [crypto.randomUUID(), vinoId, fecha, lugar || null],
    })
  }
  async function deleteToma(tomaId: string) {
    await turso.execute({ sql: 'DELETE FROM tomas WHERE id = ?', args: [tomaId] })
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
