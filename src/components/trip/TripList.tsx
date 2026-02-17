import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TripData } from '@/services/firestore'
import { TripCard } from './TripCard'

interface TripListProps {
    trips: TripData[]
    currentTripId?: string
    onTripClick: (trip: TripData) => void
    onTripEdit: (trip: TripData) => void
    onTripDelete: (trip: TripData) => void
    onCreateTrip: () => void
}

export function TripList({
    trips,
    currentTripId,
    onTripClick,
    onTripEdit,
    onTripDelete,
    onCreateTrip,
}: TripListProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Trips</h2>
                <Button
                    variant="default"
                    size="sm"
                    className="gap-1.5"
                    onClick={onCreateTrip}
                >
                    <Plus className="w-4 h-4" />
                    新增旅程
                </Button>
            </div>

            {/* Empty state */}
            {trips.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <span className="text-4xl" role="img" aria-label="map">
                        🗺️
                    </span>
                    <p className="text-gray-500 text-sm">
                        還沒有旅程，點擊右上角 + 按鈕開始記錄吧!
                    </p>
                </div>
            ) : (
                /* Trip cards — already sorted by store (newest first) */
                <div className="flex flex-col gap-3">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            trip={trip}
                            isActive={trip.id === currentTripId}
                            onClick={() => onTripClick(trip)}
                            onEdit={() => onTripEdit(trip)}
                            onDelete={() => onTripDelete(trip)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
