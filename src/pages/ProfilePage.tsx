import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ArrowLeft, LogOut, Download, Camera, Check, Pencil, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useTripStore } from '@/stores/tripStore'
import { TripData } from '@/services/firestore'
import { TripList } from '@/components/trip/TripList'
import { CreateTripModal } from '@/components/trip/CreateTripModal'
import { DeleteTripDialog } from '@/components/trip/DeleteTripDialog'
import { uploadAvatar } from '@/services/storage'

export default function ProfilePage() {
    const navigate = useNavigate()
    const { currentUser, logout, updateUserProfile } = useAuthStore()
    const { trips, currentTrip, fetchTrips, setCurrentTrip } = useTripStore()

    // Modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null)
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')

    // Avatar & displayName state
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [displayName, setDisplayName] = useState(currentUser?.displayName ?? '')
    const [isEditingName, setIsEditingName] = useState(false)
    const avatarInputRef = useRef<HTMLInputElement>(null)

    // Load trips on mount
    useEffect(() => {
        if (currentUser) {
            fetchTrips()
        }
    }, [currentUser])

    // AC-081: Format join date
    const joinDate = currentUser?.metadata.creationTime
        ? format(new Date(currentUser.metadata.creationTime), 'yyyy 年 MM 月')
        : null

    // AC-083: Logout handler
    const handleLogout = async () => {
        try {
            await logout()
            toast.success('已成功登出')
            navigate('/login')
        } catch {
            toast.error('登出失敗，請稍後再試')
        }
    }

    // AC-084: Export handler (placeholder)
    const handleExport = () => {
        toast.info('資料匯出功能即將推出')
    }

    // AC-085: Trip click handler
    const handleTripClick = (trip: TripData) => {
        setCurrentTrip(trip)
        navigate('/map')
    }

    // Edit trip handler
    const handleTripEdit = (trip: TripData) => {
        setSelectedTrip(trip)
        setModalMode('edit')
        setIsCreateModalOpen(true)
    }

    // Delete trip handler
    const handleTripDelete = (trip: TripData) => {
        setSelectedTrip(trip)
        setIsDeleteDialogOpen(true)
    }

    // Create trip handler
    const handleCreateTrip = () => {
        setSelectedTrip(null)
        setModalMode('create')
        setIsCreateModalOpen(true)
    }

    // Avatar upload handler
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !currentUser) return
        setIsUploadingAvatar(true)
        try {
            const url = await uploadAvatar(currentUser.uid, file)
            await updateUserProfile({ photoURL: url })
            toast.success('頭像已更新')
        } catch {
            toast.error('頭像上傳失敗')
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    // Display name save handler
    const handleSaveName = async () => {
        if (!currentUser) return
        try {
            await updateUserProfile({ displayName: displayName.trim() || undefined })
            toast.success('名稱已更新')
            setIsEditingName(false)
        } catch {
            toast.error('名稱更新失敗')
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* AC-081: Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm h-14 flex items-center px-4">
                <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
                    {/* Left: back button */}
                    <button
                        onClick={() => navigate('/map')}
                        className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        返回地圖
                    </button>

                    {/* Center: title */}
                    <h1 className="text-base font-semibold text-gray-900">個人中心</h1>

                    {/* Right: spacer for symmetry */}
                    <div className="w-20" />
                </div>
            </header>

            {/* Page content — offset for fixed header */}
            <main className="pt-14">
                <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">

                    {/* AC-081: User Info Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center hover:opacity-80 transition-opacity relative"
                                title="更換頭像"
                                disabled={isUploadingAvatar}
                            >
                                {isUploadingAvatar ? (
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                ) : currentUser?.photoURL ? (
                                    <img src={currentUser.photoURL} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-blue-600">
                                        {(currentUser?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
                                    </span>
                                )}
                            </button>
                            <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow">
                                <Camera className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            {/* Display Name 可編輯 */}
                            {isEditingName ? (
                                <div className="flex items-center gap-2 mb-0.5">
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName() }}
                                        className="text-sm font-semibold text-gray-900 border-b border-blue-500 outline-none bg-transparent flex-1"
                                        autoFocus
                                    />
                                    <button onClick={handleSaveName} className="p-1 text-green-600 hover:text-green-700">
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 mb-0.5">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {currentUser?.displayName || currentUser?.email || '—'}
                                    </p>
                                    <button
                                        onClick={() => { setDisplayName(currentUser?.displayName ?? ''); setIsEditingName(true) }}
                                        className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                            {currentUser?.displayName && (
                                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                            )}
                            {joinDate && (
                                <p className="text-sm text-gray-500 mt-0.5">已加入 {joinDate}</p>
                            )}
                        </div>
                    </div>

                    {/* AC-082: Trip List */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <TripList
                            trips={trips}
                            currentTripId={currentTrip?.id}
                            onTripClick={handleTripClick}
                            onTripEdit={handleTripEdit}
                            onTripDelete={handleTripDelete}
                            onCreateTrip={handleCreateTrip}
                        />
                    </div>

                    {/* AC-084: Data Management Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-base font-semibold text-gray-900 mb-4">資料管理</h2>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            匯出資料
                        </button>
                    </div>

                    {/* AC-083: Logout Button */}
                    <div className="pb-6">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-md hover:bg-red-50 transition-colors w-full justify-center"
                        >
                            <LogOut className="w-4 h-4" />
                            Log Out
                        </button>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <CreateTripModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                mode={modalMode}
                trip={selectedTrip ?? undefined}
            />

            {selectedTrip?.id && (
                <DeleteTripDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => {
                        setIsDeleteDialogOpen(false)
                        setSelectedTrip(null)
                    }}
                    tripId={selectedTrip.id}
                    tripTitle={selectedTrip.title}
                />
            )}
        </div>
    )
}
