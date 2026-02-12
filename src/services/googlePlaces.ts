import { Place } from '@/stores/mapStore';

export const getPlaceDetails = async (
    placeId: string,
    mapInstance: google.maps.Map
): Promise<Place> => {
    return new Promise((resolve, reject) => {
        const service = new google.maps.places.PlacesService(mapInstance);

        service.getDetails(
            {
                placeId: placeId,
                fields: [
                    'place_id',
                    'name',
                    'geometry',
                    'formatted_address',
                    'photos',
                    'rating',
                    'user_ratings_total',
                    'types', // For tags
                ],
            },
            (result, status) => {
                if (
                    status === google.maps.places.PlacesServiceStatus.OK &&
                    result &&
                    result.geometry &&
                    result.geometry.location
                ) {
                    // Extract photos
                    const photos =
                        result.photos?.map((photo) => photo.getUrl({ maxWidth: 800 }) || '') || [];

                    // Extract tags (using types as tags for now)
                    const tags = result.types || [];

                    const place: Place = {
                        id: result.place_id || placeId,
                        name: result.name || 'Unknown Place',
                        location: {
                            lat: result.geometry.location.lat(),
                            lng: result.geometry.location.lng(),
                        },
                        address: result.formatted_address,
                        photos: photos,
                        rating: result.rating,
                        tags: tags,
                        // Initialize other fields that might be needed
                        visitedDate: new Date().toISOString(),
                    };

                    resolve(place);
                } else {
                    reject(new Error(`Places service failed: ${status}`));
                }
            }
        );
    });
};
