import { useMap } from '@vis.gl/react-google-maps'
import { useEffect } from 'react'
import { useMapStore } from '@/stores/mapStore'

export const MapController = () => {
    const map = useMap()
    const { selectedPlace, setMapCenter } = useMapStore()

    useEffect(() => {
        if (!map || !selectedPlace) return

        // Zoom in first if needed
        const targetZoom = Math.max((map.getZoom() ?? 0), 15)
        if ((map.getZoom() ?? 0) < 15) map.setZoom(targetZoom)

        // Offset center so marker (left) + card (right) are centered together on screen
        // Card=400px, marker=36px, gap=12px → total 448px, center offset = 200px right of marker
        const degreesPerPixel =
            360 / (256 * Math.pow(2, targetZoom) * Math.cos(selectedPlace.location.lat * Math.PI / 180))
        const offsetCenter = {
            lat: selectedPlace.location.lat,
            lng: selectedPlace.location.lng + 200 * degreesPerPixel,
        }

        map.panTo(offsetCenter)
        setMapCenter(offsetCenter)

    }, [map, selectedPlace, setMapCenter])

    return null
}
