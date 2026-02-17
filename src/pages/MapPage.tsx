import { lazy, Suspense, useEffect } from 'react'
import { MapContainer } from '@/components/map/MapContainer'
import { Sidebar } from '@/components/Sidebar'
import { useMapStore } from '@/stores/mapStore'
import { useAuthStore } from '@/stores/authStore'
import { useTripStore } from '@/stores/tripStore'
import { MapDataManager } from '@/components/map/MapDataManager'
import { AllPlacesDataManager } from '@/components/map/AllPlacesDataManager'
import { cn } from '@/lib/utils'

const PlaceEditor = lazy(() => import('@/components/PlaceEditor').then(m => ({ default: m.PlaceEditor })))

export default function MapPage() {
    const { isSidebarOpen } = useMapStore()
    const { currentUser } = useAuthStore()
    const { fetchTrips, trips, createTrip } = useTripStore()

    // Auto-fetch trips when user is available
    useEffect(() => {
        if (currentUser) {
            fetchTrips()
        }
    }, [currentUser, fetchTrips])

    // Create default trip if none exists (MVP feature)
    useEffect(() => {
        const state = useTripStore.getState()
        if (currentUser && !state.loading && trips.length === 0) {
            createTrip('My First Trip', new Date(), new Date())
        }
    }, [currentUser, trips.length]) // Only check length changes

    return (
        <div className="h-screen w-screen overflow-hidden flex bg-gray-50">
            <MapDataManager />
            <AllPlacesDataManager />
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
            <Suspense fallback={null}>
                <PlaceEditor />
            </Suspense>
        </div>
    )
}
