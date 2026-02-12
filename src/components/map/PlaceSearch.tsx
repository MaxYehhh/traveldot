import { useEffect, useRef, useState } from 'react'
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps'
import { useMapStore } from '@/stores/mapStore'
import { Search, X, MapPin, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlaceSearchProps {
    onClose?: () => void
}

export const PlaceSearch = ({ onClose }: PlaceSearchProps) => {
    const map = useMap()
    const placesLib = useMapsLibrary('places')
    const [sessionToken, setSessionToken] = useState<google.maps.places.AutocompleteSessionToken | null>(null)
    const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null)
    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null)
    const [inputValue, setInputValue] = useState('')
    const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([])
    const [activeIndex, setActiveIndex] = useState(-1)
    const [isLoading, setIsLoading] = useState(false)

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
        setActiveIndex(-1) // Reset active index on input change

        if (!value) {
            setPredictions([])
            return
        }

        if (!autocompleteService || !sessionToken) return

        setIsLoading(true)
        const request = {
            input: value,
            sessionToken: sessionToken,
        }

        autocompleteService.getPlacePredictions(request, (results, status) => {
            setIsLoading(false)
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                setPredictions(results)
            } else {
                setPredictions([])
            }
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (predictions.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActiveIndex(prev => (prev < predictions.length - 1 ? prev + 1 : prev))
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex(prev => (prev > 0 ? prev - 1 : -1))
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault()
            handlePredictionSelect(predictions[activeIndex])
        }
    }

    const handlePredictionSelect = (prediction: google.maps.places.AutocompletePrediction) => {
        if (!placesService || !sessionToken) return

        setIsLoading(true)
        const request = {
            placeId: prediction.place_id,
            fields: ['place_id', 'name', 'geometry', 'formatted_address', 'photos'],
            sessionToken: sessionToken,
        }

        placesService.getDetails(request, (place, status) => {
            setIsLoading(false)
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
                })

                // Clear Search
                setInputValue('')
                setPredictions([])
                setActiveIndex(-1)

                // Refresh Session Token
                if (placesLib) {
                    setSessionToken(new placesLib.AutocompleteSessionToken())
                }

                // Close search overlay
                onClose?.()
            }
        })
    }

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-2">
                <div className="relative flex items-center gap-2">
                    <div className="relative flex-1 group">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                        </div>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="搜尋地點或標記..."
                            className="w-full rounded-2xl border-none bg-white/90 backdrop-blur-xl px-10 py-3.5 shadow-2xl ring-1 ring-black/5 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                        />
                        {inputValue && (
                            <button
                                onClick={() => {
                                    setInputValue('')
                                    setPredictions([])
                                    setActiveIndex(-1)
                                }}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* AC-060: Loading skeleton when searching */}
                {isLoading && predictions.length === 0 && inputValue && (
                    <div className="overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                        <ul className="py-2 space-y-2">
                            {[1, 2, 3].map((i) => (
                                <li key={i} className="px-4 py-3 flex items-start gap-3 animate-pulse">
                                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {predictions.length > 0 && (
                    <div className="overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
                        <ul className="max-h-[60vh] overflow-auto py-2">
                            {predictions.map((prediction, index) => (
                                <li
                                    key={prediction.place_id}
                                    onClick={() => handlePredictionSelect(prediction)}
                                    className={cn(
                                        "group cursor-pointer px-4 py-3 hover:bg-blue-50/50 transition-colors flex items-start gap-3",
                                        index === activeIndex ? "bg-blue-50" : ""
                                    )}
                                >
                                    <div className="mt-0.5 p-2 rounded-lg bg-gray-50 group-hover:bg-blue-100 text-gray-400 group-hover:text-blue-600 transition-colors">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                                            {prediction.structured_formatting.main_text}
                                        </span>
                                        <span className="text-xs text-gray-500 line-clamp-1">
                                            {prediction.structured_formatting.secondary_text}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}
