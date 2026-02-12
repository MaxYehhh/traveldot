import { useState, useEffect, useRef } from 'react'
import { useMapStore, Place } from '@/stores/mapStore'
import { useAuthStore } from '@/stores/authStore'
import { useTripStore } from '@/stores/tripStore'
import { deletePlace as deletePlaceService } from '@/services/firestore'
import { cn } from '@/lib/utils'
import { ChevronRight, ChevronLeft, MapPin, Calendar, Image as ImageIcon, Trash2, LogOut, GripVertical } from 'lucide-react'
import { toast } from 'sonner'

export const Sidebar = () => {
    const {
        places,
        selectedPlace,
        setSelectedPlace,
        deletePlace,
        isSidebarOpen,
        toggleSidebar,
        setMapCenter
    } = useMapStore()

    const { currentUser, logout } = useAuthStore()
    const { currentTrip } = useTripStore()

    const [orderedPlaces, setOrderedPlaces] = useState<Place[]>(places)
    const dragIndex = useRef<number | null>(null)
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

    useEffect(() => {
        setOrderedPlaces(places)
    }, [places])

    const handlePlaceClick = (place: Place) => {
        setSelectedPlace(place)
        setMapCenter(place.location)
    }

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (!currentUser || !currentTrip?.id) return
        if (confirm('確定要刪除這個地點嗎？')) {
            try {
                await deletePlaceService(currentUser.uid, currentTrip.id, id)
                deletePlace(id)
                toast.success('地點已刪除')
            } catch (error) {
                console.error(error)
                toast.error('刪除失敗')
            }
        }
    }

    const handleDragStart = (index: number) => {
        dragIndex.current = index
        setDraggingIndex(index)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (targetIndex: number) => {
        if (dragIndex.current === null || dragIndex.current === targetIndex) {
            setDraggingIndex(null)
            dragIndex.current = null
            return
        }
        const updated = [...orderedPlaces]
        const [moved] = updated.splice(dragIndex.current, 1)
        updated.splice(targetIndex, 0, moved)
        setOrderedPlaces(updated)
        dragIndex.current = null
        setDraggingIndex(null)
    }

    const handleDragEnd = () => {
        dragIndex.current = null
        setDraggingIndex(null)
    }

    return (
        <>
            <div
                className={cn(
                    // Common
                    "fixed bg-white/90 backdrop-blur-md shadow-2xl transition-transform duration-300 z-20 flex flex-col",

                    // Mobile: Bottom Sheet
                    "bottom-0 left-0 right-0 border-t border-white/20 h-[50vh] rounded-t-2xl",
                    isSidebarOpen ? "translate-y-0" : "translate-y-full",

                    // Desktop: Left Sidebar
                    "md:top-0 md:left-0 md:right-auto md:bottom-auto md:h-full md:w-[360px] md:border-r md:border-t-0 md:rounded-none",
                    isSidebarOpen ? "md:translate-x-0 md:translate-y-0" : "md:-translate-x-full md:translate-y-0"
                )}
            >
                {/* Header: Account Info */}
                <div className="p-4 border-b border-gray-100 bg-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                            {currentUser?.email?.[0].toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{currentUser?.email}</p>
                            <button
                                onClick={() => logout()}
                                className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                            >
                                <LogOut size={12} />
                                Sign out
                            </button>
                        </div>
                    </div>
                    {/* Mobile Toggle Button */}
                    <button
                        onClick={toggleSidebar}
                        className="md:hidden p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                    >
                        {isSidebarOpen ? <ChevronRight className="rotate-90" size={20} /> : null}
                    </button>
                </div>

                {/* Title */}
                <div className="px-4 pt-4 pb-2">
                    <h2 className="text-xl font-bold text-gray-800">儲存地點</h2>
                    <p className="text-sm text-gray-500">{places.length} places</p>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {orderedPlaces.map((place, index) => (
                        <div
                            key={place.id}
                            draggable={true}
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handlePlaceClick(place)}
                            className={cn(
                                "group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md flex gap-3 items-start",
                                selectedPlace?.id === place.id
                                    ? "bg-blue-50 border-blue-200 shadow-sm"
                                    : "bg-white border-gray-100 hover:border-gray-200",
                                draggingIndex === index && "opacity-50"
                            )}
                        >
                            {/* Drag Handle */}
                            <div
                                className="flex-shrink-0 flex items-center self-center text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing"
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                <GripVertical size={16} />
                            </div>

                            {/* Thumbnail */}
                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                {place.photos && place.photos.length > 0 ? (
                                    <img
                                        src={place.photos[0]}
                                        alt={place.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon size={20} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 group/item">
                                <div className="flex justify-between items-start">
                                    <h3 className={cn(
                                        "font-semibold text-sm truncate pr-2 flex-1",
                                        selectedPlace?.id === place.id ? "text-blue-700" : "text-gray-800"
                                    )}>
                                        {place.name}
                                    </h3>
                                    {/* Delete Button (Visible on Hover) */}
                                    <button
                                        onClick={(e) => handleDelete(e, place.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                        title="Delete place"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                {/* Tags or Address */}
                                <p className="text-xs text-gray-500 truncate mt-1 flex items-center gap-1">
                                    <MapPin size={10} />
                                    {place.address || "No address"}
                                </p>

                                {/* Date */}
                                {place.visitedDate && (
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        <Calendar size={10} />
                                        {place.visitedDate}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Desktop Collapse Button - Positioned at the right edge of the left sidebar */}
            {isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className={cn(
                        "hidden md:flex fixed top-1/2 transform -translate-y-1/2 bg-white shadow-lg border border-gray-100 rounded-r-md p-1.5 hover:bg-gray-50 text-gray-600 transition-colors z-30 w-8 h-12 items-center justify-center",
                        "hover:w-9 transition-all duration-200"
                    )}
                    aria-label="Close sidebar"
                    style={{ left: '360px' }}
                >
                    <ChevronLeft size={16} />
                </button>
            )}

            {/* Mobile Toggle Button (Floating when closed) */}
            {!isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className="md:hidden fixed bottom-6 right-6 z-20 bg-white p-3 rounded-full shadow-xl border border-gray-100 text-blue-600"
                >
                    <ChevronLeft className="rotate-90" size={24} />
                </button>
            )}

            {/* Desktop Open Button (When sidebar is closed) */}
            {!isSidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className="hidden md:flex fixed top-1/2 left-0 transform -translate-y-1/2 bg-white shadow-lg border-r border-t border-b border-gray-100 rounded-r-md p-1.5 hover:bg-gray-50 text-gray-600 transition-colors z-20 w-8 h-12 items-center justify-center"
                    aria-label="Open sidebar"
                >
                    <ChevronRight size={16} />
                </button>
            )}
        </>
    )
}
