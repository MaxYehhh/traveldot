import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps'
import { useMapStore } from '@/stores/mapStore'
import { useCallback, useState } from 'react'
import { PlaceSearch } from './PlaceSearch'
import { MapMarkers } from './MapMarkers'
import { PlacePreview } from './PlacePreview'
import { Loader2, Locate } from 'lucide-react'
import { MapEventHandler } from './MapEventHandler'
import { MapController } from './MapController'
import { cn } from '@/lib/utils'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

const MapContent = () => {
    const {
        currentLocation,
        zoom,
        setMapState,
        setMapCenter,
        selectedPlace,
        isEditorOpen,
        editorLayoutMode,
    } = useMapStore()
    const [isLoadingLocation, setIsLoadingLocation] = useState(false)

    const handleCameraChanged = useCallback((ev: MapCameraChangedEvent) => {
        setMapCenter(ev.detail.center)
    }, [setMapCenter])

    // AC-033: Handle POI Click logic moved to MapEventHandler

    const handleCurrentLocationClick = () => {
        if (!navigator.geolocation) {
            alert('您的瀏覽器不支援地理位置功能')
            return
        }

        setIsLoadingLocation(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                setMapState({
                    currentLocation: { lat: latitude, lng: longitude },
                    zoom: 16
                })
                setIsLoadingLocation(false)
            },
            (error) => {
                console.error('Error getting location:', error)
                let message = '無法取得您的位置'
                if (error.code === error.PERMISSION_DENIED) {
                    message = '請允許存取位置權限以使用此功能'
                }
                alert(message)
                setIsLoadingLocation(false)
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        )
    }

    return (
        <>
            <Map
                defaultCenter={currentLocation}
                defaultZoom={zoom}
                mapId="DEMO_MAP_ID" // Required for AdvancedMarker
                onCameraChanged={handleCameraChanged}
                className="h-full w-full"
                disableDefaultUI={true}
                clickableIcons={true} // Must be true for POIs to be clickable
                gestureHandling={'greedy'}
            >
                <MapEventHandler />
                <MapController />
                <MapMarkers />
            </Map>
            <PlaceSearch />
            {selectedPlace && !(isEditorOpen && editorLayoutMode === 'panel') && <PlacePreview />}
            <div className="absolute bottom-6 right-6 z-20">
                <button
                    onClick={handleCurrentLocationClick}
                    className={cn(
                        "group bg-white p-3.5 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center",
                        isLoadingLocation ? "cursor-not-allowed opacity-80" : "hover:bg-blue-50"
                    )}
                    disabled={isLoadingLocation}
                    aria-label="Use Current Location"
                    title="使用目前位置"
                >
                    {isLoadingLocation ? (
                        <Loader2 className="animate-spin text-blue-600" size={24} />
                    ) : (
                        <Locate className="text-gray-700 group-hover:text-blue-600 transition-colors" size={24} />
                    )}
                </button>
            </div>
            {isLoadingLocation && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
                    <div className="bg-white p-4 rounded-lg shadow-xl flex items-center gap-3">
                        <Loader2 className="animate-spin text-blue-600" />
                        <span className="font-medium">Locating...</span>
                    </div>
                </div>
            )}
        </>
    )
}

export const MapContainer = () => {
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
        <div className="h-screen w-full relative">
            <APIProvider apiKey={API_KEY}>
                <MapContent />
            </APIProvider>
        </div>
    )
}
