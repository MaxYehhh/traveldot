import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useTripStore } from '@/stores/tripStore'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'

export interface DeleteTripDialogProps {
    isOpen: boolean
    onClose: () => void
    tripId: string
    tripTitle: string
}

export const DeleteTripDialog = ({ isOpen, onClose, tripId, tripTitle }: DeleteTripDialogProps) => {
    const { deleteTrip } = useTripStore()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteTrip(tripId)
            toast.success('旅程已刪除')
            onClose()
        } catch (err: any) {
            toast.error(err?.message ?? '刪除失敗，請稍後再試')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCancel = () => {
        if (!isDeleting) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleCancel() }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <DialogTitle>確定要刪除這個旅程嗎?</DialogTitle>
                    </div>
                </DialogHeader>

                <DialogDescription className="mt-2">
                    此操作無法復原，旅程「{tripTitle}」中的所有地點也會被刪除。
                </DialogDescription>

                <DialogFooter className="mt-4 gap-2">
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={isDeleting}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700
                            hover:bg-gray-50 transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        取消
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white
                            hover:bg-red-700 transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                        確定刪除
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
