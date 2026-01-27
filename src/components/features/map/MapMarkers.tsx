import { useEffect, useState, useRef } from 'react'
import { AdvancedMarker, useMap, Pin } from '@vis.gl/react-google-maps'
import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { useMapStore, Place } from '@/hooks/useMapStore'

export const MapMarkers = () => {
    const map = useMap()
    const { selectedPlace } = useMapStore()
    const clustererRef = useRef<MarkerClusterer | null>(null)

    // In a real app, this would come from the store or API
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [places] = useState<Place[]>([
        { id: '1', name: 'Grand Palace', location: { lat: 13.7500, lng: 100.4915 } },
        { id: '2', name: 'Wat Arun', location: { lat: 13.7437, lng: 100.4889 } },
        { id: '3', name: 'Chatuchak Market', location: { lat: 13.8016, lng: 100.5519 } },
    ])

    // Initialize/Update Clusterer
    useEffect(() => {
        if (!map) return

        if (!clustererRef.current) {
            clustererRef.current = new MarkerClusterer({ map })
        }
    }, [map])

    // Update markers in clusterer
    // Note: Since we are using AdvancedMarker in React, integrating with MarkerClusterer 
    // is tricky because MarkerClusterer expects google.maps.Marker or AdvancedMarkerElement instances.
    // The @vis.gl/react-google-maps library renders components.
    // For Phase 1, we will render individual AdvancedMarkers for the 'selectedPlace'
    // and letting standard markers handle the bulk/clustered items if we were not using React components for them.
    // 
    // However, to strictly follow "React" way with Clustering is complex without a dedicated hook/wrapper.
    // Given the time constraint, I will implement the 'selectedPlace' as a distinct AdvancedMarker (Pin)
    // and for the background 'existing places', we will render them as AdvancedMarkers as well.
    // Visual clustering can be added later or verified if needed.
    //
    // WAIT: The prompt specifically asked for clustering. 
    // Let's use the ref approach to add markers to clusterer if we want true clustering.
    // But mixing React render and imperative clusterer is hard.
    // Let's stick to rendering AdvancedMarkers for now, and if user complains about clustering, 
    // we can implement the imperative approach. 
    // BUT, the task list says "Implement Clustering".

    // Let's try to add the underlying marker instances to the clusterer.
    // 'ref' prop on AdvancedMarker gives us the element.

    const markersRef = useRef<{ [key: string]: google.maps.marker.AdvancedMarkerElement }>({})

    useEffect(() => {
        if (!clustererRef.current) return;

        clustererRef.current.clearMarkers();
        const markers = Object.values(markersRef.current);
        clustererRef.current.addMarkers(markers);
    }, [places]) // Re-cluster when places change

    return (
        <>
            {/* Render existing places for clustering */}
            {places.map(place => (
                <AdvancedMarker
                    key={place.id}
                    position={place.location}
                    title={place.name}
                    ref={(marker) => {
                        if (marker) {
                            markersRef.current[place.id] = marker;
                        } else {
                            delete markersRef.current[place.id];
                        }
                    }}
                >
                    <Pin background={'#E30000'} glyphColor={'#FFF'} borderColor={'#000'} scale={0.8} />
                </AdvancedMarker>
            ))}

            {/* Render Selected/Temporary Place (Not clustered usually, or distinct style) */}
            {selectedPlace && (
                <AdvancedMarker
                    position={selectedPlace.location}
                    title={selectedPlace.name}
                    zIndex={1000} // On top
                >
                    <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} scale={1.2} />
                </AdvancedMarker>
            )}
        </>
    )
}
