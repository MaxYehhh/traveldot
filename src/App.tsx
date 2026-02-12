
import { MapContainer } from '@/components/map/MapContainer'
import { Sidebar } from '@/components/Sidebar'
import { PlaceEditor } from '@/components/PlaceEditor'
import { useMapStore } from '@/stores/mapStore'
import { useAuthStore } from '@/stores/authStore'
import { AuthPage } from '@/components/auth/AuthPage'
import { MapSkeleton } from '@/components/ui/MapSkeleton'
import { cn } from '@/lib/utils'

import { useTripStore } from '@/stores/tripStore'
import { MapDataManager } from '@/components/map/MapDataManager'
import { useEffect } from 'react'

import { Toaster } from 'sonner'

function App() {
  const { isSidebarOpen } = useMapStore()
  const { currentUser, isInitialized } = useAuthStore()
  const { fetchTrips, trips, createTrip } = useTripStore()

  // Auto-fetch trips or create default one
  useEffect(() => {
    if (currentUser) {
      fetchTrips().then(() => {
        // Check if trips are empty/loaded in store state?
        // fetchTrips sets trips in store.
        // Accessing store state inside effect requires dependency or getState.
        // Better: check trips length after fetch? fetchTrips doesn't return value.
        // We can check `trips` dependency.
      })
    }
  }, [currentUser, fetchTrips])

  // Create default trip if none exists (MVP feature)
  useEffect(() => {
    const state = useTripStore.getState();
    // Only auto-create if: 
    // 1. User is logged in
    // 2. Not already loading
    // 3. No trips exist
    // 4. We prevent infinite loop by ensuring we don't call if we just called it (handled by dependency array usually, or loading state)
    if (currentUser && !state.loading && trips.length === 0) {
      createTrip('My First Trip', new Date(), new Date())
    }
  }, [currentUser, trips.length]) // Only check length changes

  if (!isInitialized) {
    return (
      <>
        <Toaster position="top-center" />
        <MapSkeleton />
      </>
    )
  }

  if (!currentUser) {
    return (
      <>
        <Toaster position="top-center" />
        <AuthPage />
      </>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-gray-50">
      <Toaster position="top-center" />
      <MapDataManager />
      {/* Map Area - Adjusts width based on sidebar */}
      <div
        className={cn(
          "h-full transition-all duration-300 ease-in-out relative",
          isSidebarOpen ? "md:ml-[360px] md:w-[calc(100%-360px)] w-full" : "w-full"
        )}
      >
        <MapContainer />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Editor Modal */}
      <PlaceEditor />
    </div>
  )
}

export default App
