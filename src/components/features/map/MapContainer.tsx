import { APIProvider, Map } from '@vis.gl/react-google-maps'
import { useMapStore } from '@/hooks/useMapStore'
import { useCallback } from 'react'
import { PlaceSearch } from './PlaceSearch'
import { MapMarkers } from './MapMarkers'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

export const MapContainer = () => {
    const { currentLocation, zoom } = useMapStore()

    const handleCameraChanged = useCallback(() => {
        // Sync map state with store if needed, but be careful of performance
        // For now we might just want to track it or update when user stops moving
        // console.log('Camera changed:', ev.detail)
    }, [])

    if (!API_KEY) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="p-6 text-center">
                    <h2 className="text-xl font-bold text-red-500">Missing API Key</h2>
                    <p className="mt-2 text-gray-600">
                        Please add VITE_GOOGLE_MAPS_API_KEY to your .env file
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-screen w-full">
            <APIProvider apiKey={API_KEY}>
                <Map
                    defaultCenter={currentLocation}
                    defaultZoom={zoom}
                    mapId="DEMO_MAP_ID" // Required for AdvancedMarker
                    onCameraChanged={handleCameraChanged}
                    className="h-full w-full"
                    disableDefaultUI={true}
                    clickableIcons={false}
                    gestureHandling={'greedy'}
                >
                    <PlaceSearch />
                    <MapMarkers />
                </Map>
            </APIProvider>
        </div>
    )
}
