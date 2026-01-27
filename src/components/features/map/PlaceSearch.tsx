import { useEffect, useRef, useState } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useMapStore } from '@/hooks/useMapStore'

export const PlaceSearch = () => {
    const map = useMap()
    const placesLib = useMapsLibrary('places')
    const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(null)
    const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null)
    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])

    const { setSelectedPlace, setMapState } = useMapStore()
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!placesLib || !map) return

        setAutocompleteService(new placesLib.AutocompleteService())
        setPlacesService(new placesLib.PlacesService(map))
        setSessionToken(new placesLib.AutocompleteSessionToken())
    }, [placesLib, map])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setInputValue(value)

        if (!value) {
            setPredictions([])
            return
        }

        if (!autocompleteService || !sessionToken) return

        const request = {
            input: value,
            sessionToken: sessionToken,
        }

        autocompleteService.getPlacePredictions(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                setPredictions(results)
            } else {
                setPredictions([])
            }
        })
    }

    const handlePredictionSelect = (prediction: google.maps.places.AutocompletePrediction) => {
        if (!placesService || !sessionToken) return

        const request = {
            placeId: prediction.place_id,
            fields: ['place_id', 'name', 'geometry', 'formatted_address', 'photos'],
            sessionToken: sessionToken,
        }

        placesService.getDetails(request, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place && place.geometry && place.geometry.location) {

                const lat = place.geometry.location.lat()
                const lng = place.geometry.location.lng()

                // Update map center
                if (map) {
                    map.panTo({ lat, lng })
                    map.setZoom(15)
                }

                // Update Store
                setMapState({ currentLocation: { lat, lng }, zoom: 15 })
                setSelectedPlace({
                    id: place.place_id!,
                    name: place.name!,
                    location: { lat, lng },
                    address: place.formatted_address,
                    // photos: place.photos?.map(p => p.getUrl()) // Handle photo URLs later
                })

                // Clear Search
                setInputValue('')
                setPredictions([])

                // Refresh Session Token
                if (placesLib) {
                    setSessionToken(new placesLib.AutocompleteSessionToken())
                }
            }
        })
    }

    return (
        <div className="absolute left-4 top-4 z-10 w-80 shadow-lg">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Search places..."
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {inputValue && (
                    <button
                        onClick={() => {
                            setInputValue('')
                            setPredictions([])
                        }}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                )}
            </div>

            {predictions.length > 0 && (
                <ul className="mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    {predictions.map((prediction) => (
                        <li
                            key={prediction.place_id}
                            onClick={() => handlePredictionSelect(prediction)}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                        >
                            <div className="font-medium text-gray-900">{prediction.structured_formatting.main_text}</div>
                            <div className="text-sm text-gray-500">{prediction.structured_formatting.secondary_text}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
