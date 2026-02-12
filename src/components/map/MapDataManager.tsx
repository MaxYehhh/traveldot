import { useEffect } from 'react';
import { useTripStore } from '@/stores/tripStore';
import { useMapStore } from '@/stores/mapStore';
import { useAuthStore } from '@/stores/authStore';
import { subscribeToPlaces, PlaceData } from '@/services/firestore';

export function MapDataManager() {
    const { currentTrip } = useTripStore();
    const { currentUser } = useAuthStore();
    const { setPlaces } = useMapStore();

    useEffect(() => {
        if (!currentUser || !currentTrip?.id) {
            setPlaces([]);
            return;
        }

        const unsubscribe = subscribeToPlaces(currentUser.uid, currentTrip.id, (firestorePlaces) => {
            // Convert Firestore PlaceData to MapStore Place
            const mappedPlaces = firestorePlaces.map((p: PlaceData) => ({
                id: p.id!,
                name: p.name,
                location: p.coordinates,
                address: p.address,
                photos: p.content.media?.filter(m => m.type === 'photo').map(m => m.url),
                tags: p.tags,
                visitedDate: p.visitedDate?.toISOString().split('T')[0],
                content: p.content.text,
                rating: p.rating,
                color: p.color
            }));
            setPlaces(mappedPlaces);
        });

        return () => unsubscribe();
    }, [currentUser, currentTrip, setPlaces]);

    return null;
}
