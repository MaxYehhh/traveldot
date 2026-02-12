import React, { useState } from 'react'
import { X, MapPin, Calendar, Save } from 'lucide-react'
import { useMapStore, Memory } from '@/stores/mapStore'
import { RichTextEditor } from './RichTextEditor'
import { ImageUploader } from './ImageUploader'
import { TagInput } from './TagInput'
import { cn } from '@/lib/utils'

export const MemorySidebar: React.FC = () => {
    const { selectedPlace, setSelectedPlace, setActiveMemory } = useMapStore()
    const [localMemory, setLocalMemory] = useState<Memory>({
        text: '',
        photos: [],
        tags: [],
        visitedDate: new Date().toISOString()
    })

    if (!selectedPlace) return null

    const handleSave = () => {
        setActiveMemory(localMemory)
        console.log('Saved memory for:', selectedPlace.name, localMemory)
    }

    return (
        <div
            key={selectedPlace.id}
            className={cn(
                "fixed top-4 right-4 bottom-4 w-[400px] bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20 z-50 flex flex-col transition-all duration-300 transform",
                selectedPlace ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            )}>
            {/* Header */}
            <div className="p-6 border-b flex items-start justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedPlace.name}</h2>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin size={12} className="shrink-0" />
                        <span className="line-clamp-1">{selectedPlace.address || "Unknown Location"}</span>
                    </div>
                </div>
                <button
                    onClick={() => setSelectedPlace(null)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Date Field */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Calendar size={16} /> Visited Date
                    </label>
                    <input
                        type="date"
                        value={localMemory.visitedDate.split('T')[0]}
                        onChange={(e) => setLocalMemory({ ...localMemory, visitedDate: new Date(e.target.value).toISOString() })}
                        className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Text Editor */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Story</label>
                    <RichTextEditor
                        content={localMemory.text}
                        onChange={(val) => setLocalMemory({ ...localMemory, text: val })}
                    />
                </div>

                {/* Image Uploader */}
                <ImageUploader
                    photos={localMemory.photos}
                    onChange={(photos) => setLocalMemory({ ...localMemory, photos })}
                />

                {/* Tags */}
                <TagInput
                    tags={localMemory.tags}
                    onChange={(tags) => setLocalMemory({ ...localMemory, tags })}
                />
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50/50 flex gap-3">
                <button
                    onClick={() => setSelectedPlace(null)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-white border rounded-lg transition-all active:scale-95"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                    <Save size={16} /> Save Memory
                </button>
            </div>
        </div>
    )
}
