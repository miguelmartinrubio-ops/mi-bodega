import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import TabsBar from './components/TabsBar'
import AddModal from './components/AddModal'
import VinosPage from './pages/VinosPage'
import KanbanPage from './pages/KanbanPage'

export default function App() {
  const [showAdd, setShowAdd] = useState(false)
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', background: '#0d0d14', color: '#e8e0d5' }}>
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <Header />
        <StatsBar />
        <TabsBar onAdd={() => setShowAdd(true)} />
        <Routes>
          <Route path="/" element={<VinosPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
        </Routes>
        {showAdd && (
          <AddModal onClose={() => setShowAdd(false)} />
        )}
      </div>
    </div>
  )
}
