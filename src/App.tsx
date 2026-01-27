import { MapContainer } from '@/components/features/map/MapContainer'
import { MemorySidebar } from '@/components/features/editor/MemorySidebar'

function App() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <MapContainer />
      <MemorySidebar />
    </div>
  )
}

export default App
