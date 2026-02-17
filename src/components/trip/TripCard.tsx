import { format, isSameMonth, isSameYear } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TripData } from '@/services/firestore'

interface TripCardProps {
    trip: TripData
    isActive?: boolean
    onClick: () => void
    onEdit: () => void
    onDelete: () => void
}

function formatDateRange(start: Date, end: Date): string {
    if (isSameMonth(start, end) && isSameYear(start, end)) {
        // Same month: Mar 1-15, 2024
        return `${format(start, 'MMM d')}-${format(end, 'd, yyyy')}`
    }
    // Different months: Mar 1 - Apr 15, 2024
    if (isSameYear(start, end)) {
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
    }
    // Different years
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`
}

export function TripCard({ trip, isActive, onClick, onEdit, onDelete }: TripCardProps) {
    return (
        <div
            onClick={onClick}
            className={[
                'relative flex items-center gap-3 p-3 rounded-xl shadow-md cursor-pointer',
                'transition-all duration-200',
                'hover:shadow-lg hover:-translate-y-1',
                'bg-white',
                isActive ? 'ring-2 ring-blue-500 bg-blue-50' : '',
            ].join(' ')}
        >
            {/* Cover image / placeholder */}
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {trip.coverImage ? (
                    <img
                        src={trip.coverImage}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-2xl" role="img" aria-label="trip">
                        🗺️
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{trip.title}</p>
                {trip.startDate && trip.endDate && (
                    <p className="text-sm text-gray-500 mt-0.5">
                        {formatDateRange(trip.startDate, trip.endDate)}
                    </p>
                )}
                <p className="text-sm text-gray-500 mt-0.5">
                    {trip.placesCount} {trip.placesCount === 1 ? 'place' : 'places'}
                </p>
            </div>

            {/* Action buttons */}
            <div className="flex-shrink-0 flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                    }}
                    aria-label="編輯旅程"
                >
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                    aria-label="刪除旅程"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
