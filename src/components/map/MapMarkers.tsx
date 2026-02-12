import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useMapStore } from '@/stores/mapStore'
import { DEFAULT_PLACE_COLOR } from '@/utils/colors'
import { useEffect, useRef } from 'react'

export const MapMarkers = () => {
    const map = useMap()
    const markerLib = useMapsLibrary('marker') // Wait for marker library to be ready
    const { selectedPlace, places } = useMapStore()
    const markersRef = useRef<{ [key: string]: google.maps.marker.AdvancedMarkerElement }>({})

    // Sync markers imperatively to avoid re-render performance issues
    useEffect(() => {
        if (!map || !markerLib) return

        const currentIds = new Set(places.map(p => p.id))

        // Remove markers no longer in places
        Object.keys(markersRef.current).forEach(id => {
            if (!currentIds.has(id)) {
                markersRef.current[id].map = null
                delete markersRef.current[id]
            }
        })

        // Add or update markers
        places.forEach(place => {
            const isSelected = selectedPlace?.id === place.id

            if (isSelected) {
                // Hide the regular marker if selected (selected marker rendered separately below)
                if (markersRef.current[place.id]) {
                    markersRef.current[place.id].map = null
                    delete markersRef.current[place.id]
                }
                return
            }

            const color = place.color || DEFAULT_PLACE_COLOR

            // Build pin SVG
            const pin = document.createElement('div')
            pin.innerHTML = `
                <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.35))">
                    <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z" fill="${color}" stroke="#000" stroke-width="1.5"/>
                    <circle cx="14" cy="14" r="5" fill="white" opacity="0.9"/>
                </svg>
            `

            if (markersRef.current[place.id]) {
                // Update position if moved
                markersRef.current[place.id].position = place.location
                markersRef.current[place.id].content = pin.firstElementChild as HTMLElement
            } else {
                const marker = new google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: place.location,
                    title: place.name,
                    content: pin.firstElementChild as HTMLElement,
                    zIndex: 100,
                })
                marker.addListener('click', () => {
                    useMapStore.getState().setSelectedPlace(place)
                })
                markersRef.current[place.id] = marker
            }
        })
    }, [map, markerLib, places, selectedPlace])

    // Selected marker
    useEffect(() => {
        if (!map || !markerLib) return

        const SELECTED_ID = '__selected__'

        if (markersRef.current[SELECTED_ID]) {
            markersRef.current[SELECTED_ID].map = null
            delete markersRef.current[SELECTED_ID]
        }

        if (!selectedPlace) return

        const selectedColor = selectedPlace.color || DEFAULT_PLACE_COLOR
        const pin = document.createElement('div')
        pin.innerHTML = `
            <svg width="36" height="46" viewBox="0 0 36 46" fill="none" xmlns="http://www.w3.org/2000/svg" style="cursor:pointer;filter:drop-shadow(0 3px 5px rgba(0,0,0,0.4))">
                <path d="M18 0C8.059 0 0 8.059 0 18c0 12 18 28 18 28S36 30 36 18C36 8.059 27.941 0 18 0z" fill="${selectedColor}" stroke="#000" stroke-width="1.5"/>
                <circle cx="18" cy="18" r="6" fill="white" opacity="0.9"/>
            </svg>
        `

        const marker = new google.maps.marker.AdvancedMarkerElement({
            map,
            position: selectedPlace.location,
            title: selectedPlace.name,
            content: pin.firstElementChild as HTMLElement,
            zIndex: 2000,
        })
        markersRef.current[SELECTED_ID] = marker
    }, [map, markerLib, selectedPlace])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            Object.values(markersRef.current).forEach(m => { m.map = null })
            markersRef.current = {}
        }
    }, [])

    return null
}
