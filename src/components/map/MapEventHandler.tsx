import { useMap } from '@vis.gl/react-google-maps'
import { useEffect } from 'react'
import { useMapStore, Place } from '@/stores/mapStore'

export const MapEventHandler = () => {
    const map = useMap()
    const { setSelectedPlace, setMapState } = useMapStore()

    useEffect(() => {
        if (!map) return

        const listener = map.addListener('click', (ev: google.maps.MapMouseEvent) => {
            if ('placeId' in ev && ev.placeId) {
                ev.stop() // Prevent default info window
                const placeId = ev.placeId

                // Use PlacesService to get details
                const service = new google.maps.places.PlacesService(map)
                service.getDetails({
                    placeId: placeId as string,
                    fields: ['name', 'formatted_address', 'geometry', 'photos', 'rating', 'place_id']
                }, (placeResult, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && placeResult && placeResult.geometry?.location) {

                        const newPlace: Place = {
                            id: placeResult.place_id!,
                            name: placeResult.name!,
                            location: {
                                lat: placeResult.geometry.location.lat(),
                                lng: placeResult.geometry.location.lng()
                            },
                            address: placeResult.formatted_address,
                            photos: placeResult.photos?.map(p => p.getUrl({ maxWidth: 400 })).filter(Boolean) as string[],
                            rating: placeResult.rating
                        }

                        // Select the place and move map (MapController handles panTo)
                        setSelectedPlace(newPlace)
                        setMapState({ currentLocation: newPlace.location })
                    }
                })
            } else {
                // Click on background closes preview
                setSelectedPlace(null)
            }
        })

        return () => {
            google.maps.event.removeListener(listener)
        }
    }, [map, setSelectedPlace, setMapState])

    return null
}
