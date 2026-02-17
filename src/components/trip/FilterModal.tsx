import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FilterModalProps {
    isOpen: boolean
    onClose: () => void
    allTags: string[]
    activeTags: string[]
    onApply: (tags: string[]) => void
    onClear: () => void
}

export function FilterModal({
    isOpen,
    onClose,
    allTags,
    activeTags,
    onApply,
    onClear,
}: FilterModalProps) {
    const [selected, setSelected] = useState<string[]>(activeTags)

    // Sync when activeTags changes from outside
    const handleOpenChange = (open: boolean) => {
        if (open) {
            setSelected(activeTags)
        } else {
            onClose()
        }
    }

    const toggleTag = (tag: string) => {
        setSelected((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        )
    }

    const handleApply = () => {
        onApply(selected)
        onClose()
    }

    const handleClear = () => {
        setSelected([])
        onClear()
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-sm sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>篩選</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    {allTags.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                            目前沒有可用的標籤
                        </p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {allTags.map((tag) => {
                                const isSelected = selected.includes(tag)
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={cn(
                                            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                                            'border transition-colors duration-150 cursor-pointer',
                                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
                                            isSelected
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                                        )}
                                        aria-pressed={isSelected}
                                    >
                                        #{tag}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClear}>
                        清除篩選
                    </Button>
                    <Button variant="default" onClick={handleApply}>
                        套用
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
