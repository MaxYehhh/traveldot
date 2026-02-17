import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Camera, Image as ImageIcon } from 'lucide-react'
import { useTripStore } from '@/stores/tripStore'
import { useAuthStore } from '@/stores/authStore'
import { TripData } from '@/services/firestore'
import { uploadPhoto } from '@/services/storage'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'

export interface CreateTripModalProps {
    isOpen: boolean
    onClose: () => void
    mode: 'create' | 'edit'
    trip?: TripData
}

// Format a Date to "YYYY-MM-DD" for input[type=date]
function toDateInputValue(date?: Date): string {
    if (!date) return ''
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

// Parse "YYYY-MM-DD" to Date (local midnight)
function fromDateInputValue(value: string): Date | null {
    if (!value) return null
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year, month - 1, day)
}

export const CreateTripModal = ({ isOpen, onClose, mode, trip }: CreateTripModalProps) => {
    const { createTrip, updateTrip } = useTripStore()
    const { currentUser } = useAuthStore()

    // Form state
    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    // Validation errors
    const [errors, setErrors] = useState<{
        title?: string
        endDate?: string
    }>({})

    // Loading / submission state
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Cover photo state (edit mode only)
    const [isUploadingCover, setIsUploadingCover] = useState(false)
    const coverInputRef = useRef<HTMLInputElement>(null)

    // Ref for auto-focus on title input
    const titleRef = useRef<HTMLInputElement>(null)

    // Prefill form when editing
    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && trip) {
                setTitle(trip.title)
                setStartDate(toDateInputValue(trip.startDate))
                setEndDate(toDateInputValue(trip.endDate))
            } else {
                setTitle('')
                setStartDate('')
                setEndDate('')
            }
            setErrors({})
            setIsSubmitting(false)
        }
    }, [isOpen, mode, trip])

    // Auto-focus title input when modal opens
    useEffect(() => {
        if (isOpen) {
            // Small delay to allow animation to start
            const timer = setTimeout(() => {
                titleRef.current?.focus()
            }, 50)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    const validate = (): boolean => {
        const newErrors: { title?: string; endDate?: string } = {}

        if (!title.trim()) {
            newErrors.title = '請輸入旅程名稱'
        }

        if (startDate && endDate) {
            const start = fromDateInputValue(startDate)
            const end = fromDateInputValue(endDate)
            if (start && end && end < start) {
                newErrors.endDate = '結束日期不能早於開始日期'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validate()) {
            // Focus back to title if title error
            if (errors.title || !title.trim()) {
                titleRef.current?.focus()
            }
            return
        }

        const parsedStart = fromDateInputValue(startDate) ?? new Date()
        const parsedEnd = fromDateInputValue(endDate) ?? new Date()

        setIsSubmitting(true)
        try {
            if (mode === 'create') {
                await createTrip(title.trim(), parsedStart, parsedEnd)
                toast.success('旅程已建立')
            } else if (mode === 'edit' && trip?.id) {
                await updateTrip(trip.id, {
                    title: title.trim(),
                    startDate: parsedStart,
                    endDate: parsedEnd,
                })
                toast.success('旅程已更新')
            }
            onClose()
        } catch (err: any) {
            toast.error(err?.message ?? '操作失敗，請稍後再試')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !currentUser || !trip?.id) return
        setIsUploadingCover(true)
        try {
            const url = await uploadPhoto(currentUser.uid, trip.id, file)
            await updateTrip(trip.id, { coverImage: url })
            toast.success('封面照已更新')
        } catch {
            toast.error('封面照上傳失敗')
        } finally {
            setIsUploadingCover(false)
        }
    }

    const handleCancel = () => {
        if (!isSubmitting) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleCancel() }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? '建立新旅程' : '編輯旅程'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4 py-4">
                        {/* Cover Photo — edit mode only */}
                        {mode === 'edit' && (
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">封面照</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        {trip?.coverImage ? (
                                            <img src={trip.coverImage} alt="cover" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="w-6 h-6 text-gray-300" />
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => coverInputRef.current?.click()}
                                            disabled={isUploadingCover || isSubmitting}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        >
                                            {isUploadingCover ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Camera className="w-3.5 h-3.5" />
                                            )}
                                            {isUploadingCover ? '上傳中...' : '更換封面'}
                                        </button>
                                        <input
                                            ref={coverInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleCoverChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Trip Title */}
                        <div className="space-y-1">
                            <label
                                htmlFor="trip-title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                旅程名稱
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                ref={titleRef}
                                id="trip-title"
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                    if (errors.title) setErrors(prev => ({ ...prev, title: undefined }))
                                }}
                                placeholder="例：泰國清邁之旅"
                                disabled={isSubmitting}
                                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    ${errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        {/* Start Date */}
                        <div className="space-y-1">
                            <label
                                htmlFor="trip-start-date"
                                className="block text-sm font-medium text-gray-700"
                            >
                                開始日期
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="trip-start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                disabled={isSubmitting}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-colors
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-1">
                            <label
                                htmlFor="trip-end-date"
                                className="block text-sm font-medium text-gray-700"
                            >
                                結束日期
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                id="trip-end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value)
                                    if (errors.endDate) setErrors(prev => ({ ...prev, endDate: undefined }))
                                }}
                                disabled={isSubmitting}
                                className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors
                                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    ${errors.endDate ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.endDate && (
                                <p className="text-sm text-red-500">{errors.endDate}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700
                                hover:bg-gray-50 transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
                                hover:bg-blue-700 transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {mode === 'create' ? '建立' : '儲存'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
