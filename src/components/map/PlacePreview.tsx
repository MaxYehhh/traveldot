import { useMapStore } from '@/stores/mapStore'
import { useAuthStore } from '@/stores/authStore'
import { useTripStore } from '@/stores/tripStore'
import { deletePlace as deletePlaceService } from '@/services/firestore'
import { X, MapPin, Calendar, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export const PlacePreview = () => {
    const {
        selectedPlace,
        setSelectedPlace,
        openEditor,
        deletePlace
    } = useMapStore()
    const { currentUser } = useAuthStore()
    const { currentTrip } = useTripStore()
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const [isClosing, setIsClosing] = useState(false)

    // Reset photo index when selected place changes
    useEffect(() => {
        setCurrentPhotoIndex(0)
    }, [selectedPlace?.id])

    // ESC key to close (AC-025)
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    if (!selectedPlace) return null

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setSelectedPlace(null)
            setIsClosing(false)
        }, 200) // Match animation duration
    }

    // Display data (remove mock defaults per AC-034)
    const displayPlace = {
        ...selectedPlace,
        tags: selectedPlace.tags || [],
        visitedDate: selectedPlace.visitedDate || new Date().toISOString().split('T')[0],
    }

    // Parse content for HTML rendering
    const unsafeContent: any = displayPlace.content
    const htmlContent = (typeof unsafeContent === 'object' && unsafeContent?.text)
        ? unsafeContent.text
        : (typeof unsafeContent === 'string' ? unsafeContent : '')

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation()
        const photos = displayPlace.photos
        if (photos && photos.length > 0) {
            setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
        }
    }

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation()
        const photos = displayPlace.photos
        if (photos && photos.length > 0) {
            setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
        }
    }

    const hasPhotos = displayPlace.photos && displayPlace.photos.length > 0

    return (
        <div
            className={cn(
                "absolute top-1/2 left-[calc(50%-180px)] -translate-y-1/2 z-50 group",
                "w-[360px] h-[720px] max-w-[90vw]",
                "rounded-3xl overflow-hidden shadow-2xl",
                "transition-all duration-200 ease-out origin-center",
                isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-in fade-in zoom-in-95 duration-200"
            )}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Background Layer: full-bleed photo or gradient placeholder */}
            <div className="absolute inset-0">
                {hasPhotos ? (
                    <img
                        src={displayPlace.photos![currentPhotoIndex]}
                        alt={displayPlace.name}
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 flex items-center justify-center">
                        <MapPin size={64} className="text-white/30" />
                    </div>
                )}
            </div>

            {/* Top mask + close button */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/40 to-transparent z-10">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                    style={{ backdropFilter: 'blur(4px)' }}
                >
                    <X size={18} />
                </button>
            </div>

            {/* Photo navigation arrows (visible on hover) */}
            {hasPhotos && displayPlace.photos!.length > 1 && (
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={prevPhoto}
                        className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all active:scale-95 pointer-events-auto"
                        style={{ backdropFilter: 'blur(4px)' }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextPhoto}
                        className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all active:scale-95 pointer-events-auto"
                        style={{ backdropFilter: 'blur(4px)' }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Bottom info area */}
            <div
                className="absolute bottom-0 inset-x-0 z-10 px-5 pt-10 pb-5"
                style={{
                    backdropFilter: 'blur(12px)',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.50) 60%, transparent 100%)',
                }}
            >
                {/* Dot indicators */}
                {hasPhotos && displayPlace.photos!.length > 1 && (
                    <div className="flex justify-center gap-1.5 mb-3">
                        {displayPlace.photos!.map((_, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    idx === currentPhotoIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                )}

                {/* Place name */}
                <h2 className="text-2xl font-bold text-white leading-tight mb-1">
                    {displayPlace.name}
                </h2>

                {/* Address */}
                {displayPlace.address && (
                    <div className="flex items-start gap-1.5 text-sm text-white/80 mb-1">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{displayPlace.address}</span>
                    </div>
                )}

                {/* Visited date */}
                {displayPlace.visitedDate && (
                    <div className="flex items-center gap-1.5 text-sm text-white/80 mb-2">
                        <Calendar size={14} className="shrink-0" />
                        <span>{displayPlace.visitedDate}</span>
                    </div>
                )}

                {/* Tags */}
                {displayPlace.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {displayPlace.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-2.5 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Note preview */}
                {htmlContent && (
                    <div
                        className="text-sm text-white/70 line-clamp-2 mb-3"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-3">
                    {/* Delete: Only show if place is saved (has ID in store) */}
                    {useMapStore.getState().places.find(p => p.id === selectedPlace.id) && (
                        <button
                            onClick={async (e) => {
                                e.stopPropagation()
                                if (!currentUser || !currentTrip?.id) return
                                if (confirm('確定要刪除這個地點嗎？')) {
                                    try {
                                        await deletePlaceService(currentUser.uid, currentTrip.id, selectedPlace.id)
                                        deletePlace(selectedPlace.id)
                                        setSelectedPlace(null)
                                        toast.success('地點已刪除')
                                    } catch (error) {
                                        console.error(error)
                                        toast.error('刪除失敗')
                                    }
                                }
                            }}
                            className="p-2.5 text-white/70 hover:text-red-300 transition-colors rounded-xl"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}
                    <button
                        onClick={() => openEditor('edit')}
                        className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 font-semibold py-2.5 px-4 rounded-xl text-sm transition-all hover:bg-white/90 active:scale-95"
                    >
                        <Edit size={16} />
                        編輯
                    </button>
                </div>
            </div>
        </div>
    )
}
