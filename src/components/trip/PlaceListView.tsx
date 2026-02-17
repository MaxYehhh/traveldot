import { format } from 'date-fns'
import { MapPin } from 'lucide-react'
import { PlaceData } from '@/services/firestore'

interface PlaceListViewProps {
    places: PlaceData[]
    activeTagFilters: string[]
    onPlaceClick: (place: PlaceData) => void
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5" aria-label={`評分 ${rating} 顆星`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
                    aria-hidden="true"
                >
                    ★
                </span>
            ))}
        </div>
    )
}

export function PlaceListView({ places, activeTagFilters, onPlaceClick }: PlaceListViewProps) {
    // Filter by active tags if any
    const filteredPlaces =
        activeTagFilters.length > 0
            ? places.filter((p) =>
                  activeTagFilters.every((tag) => p.tags?.includes(tag))
              )
            : places

    // Sort by visitedDate descending
    const sortedPlaces = [...filteredPlaces].sort((a, b) => {
        const aTime = a.visitedDate ? new Date(a.visitedDate).getTime() : 0
        const bTime = b.visitedDate ? new Date(b.visitedDate).getTime() : 0
        return bTime - aTime
    })

    return (
        <div
            className="pt-4 animate-fade-in"
            style={{
                animation: 'fadeIn 300ms ease-in-out',
            }}
        >
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 300ms ease-in-out;
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-fade-in {
                        animation: none;
                    }
                }
            `}</style>

            {sortedPlaces.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <span className="text-4xl" role="img" aria-label="map">
                        🗺️
                    </span>
                    <p className="text-gray-500 text-sm">
                        {activeTagFilters.length > 0
                            ? '沒有符合篩選條件的地點'
                            : '還沒有地點記錄'}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {sortedPlaces.map((place) => {
                        const firstPhoto = place.content?.media?.[0]?.url
                        const visitedDate = place.visitedDate
                            ? new Date(place.visitedDate)
                            : null

                        return (
                            <div
                                key={place.id}
                                onClick={() => onPlaceClick(place)}
                                className="flex items-start gap-3 p-3 rounded-xl bg-white shadow-sm cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                            >
                                {/* Date */}
                                <div className="flex-shrink-0 w-12 text-center pt-0.5">
                                    {visitedDate && (
                                        <span className="text-lg font-bold text-blue-600 leading-tight">
                                            {format(visitedDate, 'MM/dd')}
                                        </span>
                                    )}
                                </div>

                                {/* Main content */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {place.name}
                                    </p>
                                    {place.address && (
                                        <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1 truncate">
                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                            {place.address}
                                        </p>
                                    )}
                                    {place.rating !== undefined && place.rating > 0 && (
                                        <div className="mt-1">
                                            <StarRating rating={place.rating} />
                                        </div>
                                    )}
                                    {place.tags && place.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {place.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail */}
                                {firstPhoto && (
                                    <div className="flex-shrink-0">
                                        <img
                                            src={firstPhoto}
                                            alt={place.name}
                                            className="w-20 h-20 rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
