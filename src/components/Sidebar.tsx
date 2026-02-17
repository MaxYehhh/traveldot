import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoSidebar from '@/assets/logo_sidebar.png'
import { useMapStore, Place } from '@/stores/mapStore'
import { useAuthStore } from '@/stores/authStore'
import { useTripStore } from '@/stores/tripStore'
import { deletePlace as deletePlaceService } from '@/services/firestore'
import { cn } from '@/lib/utils'
import { ChevronRight, ChevronLeft, ChevronDown, MapPin, Calendar, Image as ImageIcon, Trash2, LogOut } from 'lucide-react'
import { toast } from 'sonner'

export const Sidebar = () => {
    const {
        allPlaces,
        selectedPlace,
        setSelectedPlace,
        isSidebarOpen,
        toggleSidebar,
        setMapCenter
    } = useMapStore()

    const { currentUser, logout } = useAuthStore()
    const { trips, currentTrip, setCurrentTrip } = useTripStore()
    const navigate = useNavigate()

    // Track which trips are expanded in the nested view
    const [expandedTrips, setExpandedTrips] = useState<Set<string>>(new Set(trips.map(t => t.id!)))
    const [tripsExpanded, setTripsExpanded] = useState(true)
    const [dotsExpanded, setDotsExpanded] = useState(true)

    const handlePlaceClick = (place: Place) => {
        setSelectedPlace(place)
        setMapCenter(place.location)
    }

    const handleDelete = async (e: React.MouseEvent, place: Place) => {
        e.stopPropagation()
        if (!currentUser) return
        const tripId = place.tripId || currentTrip?.id
        if (!tripId) return
        if (confirm('確定要刪除這個地點嗎？')) {
            try {
                await deletePlaceService(currentUser.uid, tripId, place.id)
                toast.success('地點已刪除')
            } catch (error) {
                console.error(error)
                toast.error('刪除失敗')
            }
        }
    }

    const toggleTripExpanded = (tripId: string) => {
        setExpandedTrips(prev => {
            const next = new Set(prev)
            if (next.has(tripId)) {
                next.delete(tripId)
            } else {
                next.add(tripId)
            }
            return next
        })
    }

    // Dot card component (shared between nested + flat views)
    const DotCard = ({ place }: { place: Place }) => (
        <div
            key={place.id}
            onClick={() => handlePlaceClick(place)}
            className={cn(
                "group relative p-2.5 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md flex gap-2.5 items-start",
                selectedPlace?.id === place.id
                    ? "bg-blue-50 border-blue-200 shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-200",
            )}
        >
            {/* Thumbnail */}
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                {(place.photo_refs && place.photo_refs.length > 0) || (place.photos && place.photos.length > 0) ? (
                    <img
                        src={
                            place.photo_refs && place.photo_refs.length > 0
                                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photo_refs[0]}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
                                : place.photos![0]
                        }
                        alt={place.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={16} />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <h3 className={cn(
                        "font-semibold text-xs truncate pr-1 flex-1",
                        selectedPlace?.id === place.id ? "text-blue-700" : "text-gray-800"
                    )}>
                        {place.name}
                    </h3>
                    <button
                        onClick={(e) => handleDelete(e, place)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                        title="Delete place"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5 flex items-center gap-0.5">
                    <MapPin size={9} />
                    {place.address || "No address"}
                </p>
                {place.visitedDate && (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-0.5">
                        <Calendar size={9} />
                        {place.visitedDate}
                    </p>
                )}
            </div>
        </div>
    )

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
                {/* Header: Logo & Account */}
                <div className="p-4 border-b border-gray-100 bg-white/50 flex flex-col gap-4">
                    {/* Logo */}
                    <div className="flex justify-center py-2">
                        <img src={logoSidebar} alt="TravelDot" className="h-16 object-contain" />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* 點擊頭像 → 個人中心 */}
                            <button
                                onClick={() => navigate('/profile')}
                                className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0 hover:bg-blue-200 transition-colors"
                                title="個人中心"
                            >
                                {currentUser?.photoURL ? (
                                    <img src={currentUser.photoURL} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    (currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()
                                )}
                            </button>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {currentUser?.displayName || currentUser?.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {/* Mobile Toggle Button */}
                            <button
                                onClick={toggleSidebar}
                                className="md:hidden p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                            >
                                {isSidebarOpen ? <ChevronRight className="rotate-90" size={20} /> : null}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trips + Dots Sections */}
                <div className="flex-1 overflow-y-auto">

                    {/* ── Trips（巢狀：每個 trip 下顯示其 dots）── */}
                    <div className="px-3 pt-3">
                        <button
                            onClick={() => setTripsExpanded(e => !e)}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trips</span>
                            <ChevronDown
                                size={14}
                                className={cn("text-gray-400 transition-transform duration-200", tripsExpanded ? "" : "-rotate-90")}
                            />
                        </button>

                        {tripsExpanded && (
                            <div className="mt-1 space-y-1">
                                {trips.length === 0 && (
                                    <p className="px-3 py-2 text-xs text-gray-400">尚無旅程</p>
                                )}
                                {trips.map(trip => {
                                    const tripPlaces = allPlaces.filter(p => p.tripId === trip.id)
                                    const isActive = currentTrip?.id === trip.id
                                    const isOpen = expandedTrips.has(trip.id!)

                                    return (
                                        <div key={trip.id}>
                                            {/* Trip row */}
                                            <div className={cn(
                                                "flex items-center rounded-lg transition-all",
                                                isActive ? "bg-blue-50" : "hover:bg-gray-50"
                                            )}>
                                                {/* Chevron toggle */}
                                                <button
                                                    onClick={() => toggleTripExpanded(trip.id!)}
                                                    className="p-1.5 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                                >
                                                    <ChevronDown
                                                        size={13}
                                                        className={cn("transition-transform duration-200", isOpen ? "" : "-rotate-90")}
                                                    />
                                                </button>
                                                {/* Trip name (click to set current) */}
                                                <button
                                                    onClick={() => setCurrentTrip(trip)}
                                                    className={cn(
                                                        "flex-1 text-left px-1 py-2 text-sm min-w-0",
                                                        isActive
                                                            ? "border-l-2 border-blue-500 text-blue-700 font-semibold pl-2"
                                                            : "border-l-2 border-transparent text-gray-700 pl-2"
                                                    )}
                                                >
                                                    <p className="font-medium truncate">{trip.title}</p>
                                                    {(trip.startDate || trip.endDate) && (
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            {trip.startDate ? new Date(trip.startDate).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }) : ''}
                                                            {trip.startDate && trip.endDate ? ' – ' : ''}
                                                            {trip.endDate ? new Date(trip.endDate).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' }) : ''}
                                                        </p>
                                                    )}
                                                </button>
                                                {/* Dot count badge */}
                                                {tripPlaces.length > 0 && (
                                                    <span className="mr-2 text-xs text-gray-400 flex-shrink-0">{tripPlaces.length}</span>
                                                )}
                                            </div>

                                            {/* Nested dots */}
                                            {isOpen && tripPlaces.length > 0 && (
                                                <div className="ml-6 mt-0.5 mb-1 space-y-1">
                                                    {tripPlaces.map(place => (
                                                        <DotCard key={place.id} place={place} />
                                                    ))}
                                                </div>
                                            )}
                                            {isOpen && tripPlaces.length === 0 && (
                                                <p className="ml-6 px-2 py-1 text-xs text-gray-400">尚無地點</p>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="my-2 mx-3 border-t border-gray-100" />

                    {/* ── Dots（所有旅程的全部地點）── */}
                    <div className="px-3 pb-3">
                        <button
                            onClick={() => setDotsExpanded(e => !e)}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors text-left"
                        >
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Dots{allPlaces.length > 0 ? ` (${allPlaces.length})` : ''}
                            </span>
                            <ChevronDown
                                size={14}
                                className={cn("text-gray-400 transition-transform duration-200", dotsExpanded ? "" : "-rotate-90")}
                            />
                        </button>
                        {dotsExpanded && (
                            <div className="mt-1 space-y-1">
                                {allPlaces.map(place => (
                                    <DotCard key={place.id} place={place} />
                                ))}
                                {allPlaces.length === 0 && (
                                    <p className="px-3 py-2 text-xs text-gray-400">尚無地點</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Log Out - 固定底部 */}
                <div className="shrink-0 border-t border-gray-100 p-3">
                    <button
                        onClick={async () => { await logout(); navigate('/login') }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={15} />
                        Log Out
                    </button>
                </div>
            </div>

            {/* Desktop Collapse Button */}
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
