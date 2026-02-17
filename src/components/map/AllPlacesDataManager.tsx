import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useTripStore } from '@/stores/tripStore'
import { useMapStore, Place } from '@/stores/mapStore'
import { subscribeToPlaces, PlaceData } from '@/services/firestore'

const placeDataToPlace = (data: PlaceData, tripId: string): Place => ({
    id: data.id ?? '',
    name: data.name,
    location: {
        lat: data.coordinates.lat,
        lng: data.coordinates.lng,
    },
    address: data.address,
    photos: data.content?.media?.map(m => m.url) ?? [],
    color: data.color,
    tripId,
    rating: data.rating,
    tags: data.tags,
    visitedDate: data.visitedDate instanceof Date
        ? data.visitedDate.toISOString().split('T')[0]
        : undefined,
    content: data.content?.text,
})

export const AllPlacesDataManager = () => {
    const { currentUser } = useAuthStore()
    const { trips } = useTripStore()
    const { setAllPlaces } = useMapStore()

    useEffect(() => {
        if (!currentUser || trips.length === 0) {
            setAllPlaces([])
            return
        }

        // Collect places from all trips
        const placesMap = new Map<string, Place[]>()

        const unsubscribers = trips.map(trip => {
            return subscribeToPlaces(currentUser.uid, trip.id!, (places: PlaceData[]) => {
                placesMap.set(trip.id!, places.map(p => placeDataToPlace(p, trip.id!)))
                // Merge all trips' places
                const allPlaces: Place[] = []
                placesMap.forEach(tripPlaces => allPlaces.push(...tripPlaces))
                setAllPlaces(allPlaces)
            })
        })

        return () => {
            unsubscribers.forEach(unsub => unsub())
        }
    }, [currentUser, trips])

    return null
}
