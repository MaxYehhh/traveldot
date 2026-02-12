import { useMapStore } from '@/stores/mapStore'
import { useTripStore } from '@/stores/tripStore'
import { useAuthStore } from '@/stores/authStore'
import { createPlace, updatePlace, deletePlace as deletePlaceService } from '@/services/firestore'
import { uploadPhoto } from '@/services/storage'
import { toast } from 'sonner'
import { X, Save, Trash2, Check, Calendar, Tag, Image as ImageIcon, Plus, PanelRight, Maximize2 } from 'lucide-react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { RichTextEditor } from './editor/RichTextEditor'
import { DraggablePhotoGrid } from './editor/DraggablePhotoGrid'
import { cn } from '@/lib/utils'
import { PLACE_COLORS, DEFAULT_PLACE_COLOR } from '@/utils/colors'

export const PlaceEditor = () => {
    const {
        isEditorOpen,
        editorMode,
        selectedPlace,
        places,
        closeEditor,
        setSelectedPlace,
        editorLayoutMode,
        setEditorLayoutMode,
    } = useMapStore()

    const { currentTrip } = useTripStore()
    const { currentUser } = useAuthStore()

    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [photos, setPhotos] = useState<string[]>([]) // URLs
    const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]) // Files to upload
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [visitedDate, setVisitedDate] = useState('')
    const [color, setColor] = useState<string>(DEFAULT_PLACE_COLOR)

    // Photo upload status tracking (AC-062)
    // Note: photoStatuses is reserved for future UI enhancements to show individual photo upload status

    // Validation State
    const [errors, setErrors] = useState<{ name?: string }>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const layoutMode = editorLayoutMode
    const setLayoutMode = setEditorLayoutMode
    const [panelWidth, setPanelWidth] = useState(480)
    const isResizing = useRef(false)
    const startX = useRef(0)
    const startWidth = useRef(0)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const nameInputRef = useRef<HTMLInputElement>(null)

    const handleResizeStart = useCallback((e: React.MouseEvent) => {
        isResizing.current = true
        startX.current = e.clientX
        startWidth.current = panelWidth

        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing.current) return
            const delta = startX.current - e.clientX
            const newWidth = Math.min(800, Math.max(360, startWidth.current + delta))
            setPanelWidth(newWidth)
        }

        const handleMouseUp = () => {
            isResizing.current = false
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }, [panelWidth])

    // Reset/Pre-fill form when opening
    useEffect(() => {
        if (isEditorOpen && editorMode === 'edit' && selectedPlace) {
            setName(selectedPlace.name)
            // Parse content: check if object (new schema) or string (legacy)
            const unsafeContent: any = selectedPlace.content
            const textContent = (typeof unsafeContent === 'object' && unsafeContent?.text)
                ? unsafeContent.text
                : (typeof unsafeContent === 'string' ? unsafeContent : '')

            setContent(textContent)
            setPhotos(selectedPlace.photos || [])
            setNewPhotoFiles([])
            setTags(selectedPlace.tags || [])
            setVisitedDate(selectedPlace.visitedDate || new Date().toISOString().split('T')[0])
            setColor(selectedPlace.color || DEFAULT_PLACE_COLOR)
            setErrors({})
        } else if (isEditorOpen && editorMode === 'add') {
            setName(selectedPlace?.name || '')
            setContent('')
            setPhotos([])
            setNewPhotoFiles([])
            setTags([])
            setVisitedDate(new Date().toISOString().split('T')[0])
            setColor(DEFAULT_PLACE_COLOR)
            setErrors({})
            setIsSubmitting(false)
        }
    }, [isEditorOpen, editorMode, selectedPlace])

    if (!isEditorOpen) return null

    const validateForm = () => {
        const newErrors: { name?: string } = {}
        if (!name.trim()) {
            newErrors.name = '請輸入地點名稱'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const withTimeout = <T,>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> => {
        let timer: NodeJS.Timeout;
        const timeoutPromise = new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error(errorMsg)), ms);
        });
        return Promise.race([
            promise.finally(() => clearTimeout(timer)),
            timeoutPromise
        ]);
    };

    const handleSave = async () => {
        if (!validateForm()) {
            if (!name.trim() && nameInputRef.current) {
                nameInputRef.current.focus()
            }
            return
        }

        if (!currentUser || !currentTrip?.id) {
            toast.error('找不到使用者或旅程資訊')
            return
        }

        if (!navigator.onLine) {
            toast.error('目前沒有網路連線，請檢查網路設定')
            return
        }

        setIsSubmitting(true)

        // Type assertion after null check
        const tripId = currentTrip.id;

        try {
            // 1. Upload new photos (AC-062: Individual error handling)
            const uploadedPhotoUrls: string[] = []
            const uploadErrors: { index: number; message: string }[] = []

            if (newPhotoFiles.length > 0) {
                // Use Promise.allSettled for individual error handling
                const uploadResults = await Promise.allSettled(
                    newPhotoFiles.map(async (file) => {
                        // File size check (< 10MB)
                        if (file.size > 10 * 1024 * 1024) {
                            throw new Error('檔案過大,請選擇小於 10MB 的照片');
                        }

                        // File format check
                        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                            throw new Error('不支援此格式,請選擇 JPG 或 PNG');
                        }

                        return await withTimeout(
                            uploadPhoto(currentUser.uid, tripId, file),
                            20000,
                            '照片上傳回應過慢 (超過20秒)，請檢查網路狀況'
                        );
                    })
                );

                // Process results
                uploadResults.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        uploadedPhotoUrls.push(result.value);
                    } else {
                        uploadErrors.push({
                            index,
                            message: result.reason?.message || '上傳失敗'
                        });
                    }
                });

                // If ALL uploads failed, throw error
                if (uploadedPhotoUrls.length === 0 && newPhotoFiles.length > 0) {
                    throw new Error('所有照片上傳失敗，請檢查網路或檔案格式');
                }

                // If some failed, show warning
                if (uploadErrors.length > 0) {
                    toast.error(`${uploadErrors.length} 張照片上傳失敗，已儲存其他照片`);
                }
            }

            // Combine existing photos
            const existingdbPhotos = photos.filter(p => p.startsWith('http'))
            const finalPhotos = [...existingdbPhotos, ...uploadedPhotoUrls]

            const placeData = {
                tripId: tripId,
                name,
                coordinates: editorMode === 'edit' && selectedPlace ? selectedPlace.location : { lat: 13.7563, lng: 100.5018 },
                address: editorMode === 'edit' && selectedPlace ? (selectedPlace.address || '') : '',
                visitedDate: new Date(visitedDate),
                color, // Phase 2: Custom Color
                content: {
                    text: content,
                    media: finalPhotos.map(url => ({
                        type: 'photo' as const,
                        url,
                        timestamp: new Date()
                    }))
                },
                tags,
                rating: 4.5, // TODO: Add rating UI
                isPublic: false
            }

            // 2. Save to Firestore (Wrapped in Timeout)
            let savedPlaceId: string;
            if (editorMode === 'edit' && selectedPlace) {
                await withTimeout(
                    updatePlace(currentUser.uid, tripId, selectedPlace.id, placeData),
                    10000,
                    '資料儲存回應過慢 (超過10秒)，可能是網路不穩或後端無回應'
                );
                savedPlaceId = selectedPlace.id;
            } else {
                savedPlaceId = await withTimeout(
                    createPlace(currentUser.uid, tripId, placeData),
                    10000,
                    '資料儲存回應過慢 (超過10秒)，可能是網路不穩或後端無回應'
                );
            }

            // AC-039: Update selectedPlace to trigger map pan animation (via MapController)
            const savedPlace = {
                id: savedPlaceId,
                name: placeData.name,
                location: placeData.coordinates,
                address: placeData.address || '',
                photos: finalPhotos,
                color: placeData.color,
                rating: placeData.rating,
                tags: placeData.tags,
                visitedDate: placeData.visitedDate.toISOString().split('T')[0],
                content: placeData.content.text
            };
            setSelectedPlace(savedPlace);

            if (editorMode === 'edit') {
                toast.success('地點已更新')
            } else {
                toast.success('地點已新增')
            }

            closeEditor()
        } catch (error: any) {
            console.error("Save Place Error Details:", error);
            if (error.code === 'permission-denied') {
                console.error("Permission Denied. Check Firestore Rules or Auth State.");
                toast.error('權限不足，無法儲存資料');
            } else {
                toast.error(`儲存失敗: ${error.message || '未知錯誤'}`);
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files)
            setNewPhotoFiles(prev => [...prev, ...files])

            // Generate previews
            const newPreviews = files.map(file => URL.createObjectURL(file))
            setPhotos(prev => [...prev, ...newPreviews])
        }
    }

    const removePhoto = (index: number) => {
        const confirmed = window.confirm('確定刪除這張照片?');
        if (confirmed) {
            const photoToRemove = photos[index];
            setPhotos(photos.filter((_, i) => i !== index));
            if (!photoToRemove.startsWith('http')) {
                // 新照片（blob URL），需找到對應的 newPhotoFiles index
                const blobIndex = photos.slice(0, index).filter(p => !p.startsWith('http')).length;
                setNewPhotoFiles(prev => prev.filter((_, i) => i !== blobIndex));
            }
            // 已存在的 http URL：直接從 photos 移除即可，不動 newPhotoFiles
        }
    }

    const addTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing && tagInput.trim()) {
            e.preventDefault()
            const newTag = tagInput.trim()
            if (!tags.includes(newTag)) {
                setTags([...tags, newTag])
            }
            // Ensure state update happens
            setTimeout(() => setTagInput(''), 0)
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleDelete = async () => {
        if (!selectedPlace || !currentUser || !currentTrip?.id) return
        if (confirm('確定要刪除這個地點嗎？')) {
            try {
                await deletePlaceService(currentUser.uid, currentTrip.id, selectedPlace.id)
                toast.success('地點已刪除')
                closeEditor()
                setSelectedPlace(null)
            } catch (error) {
                console.error(error)
                toast.error('刪除失敗')
            }
        }
    }

    // 共用的編輯器內容（Top Actions Bar + Scrollable content）
    const editorInner = (
        <>
            {/* Top Actions Bar */}
            <div className="flex items-center justify-between px-8 pt-6 pb-2 shrink-0">
                <div className="flex items-center gap-1">
                    <button
                        onClick={closeEditor}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                    <button
                        onClick={() => setLayoutMode(layoutMode === 'popup' ? 'panel' : 'popup')}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-600"
                        title={layoutMode === 'popup' ? '切換為側邊面板' : '切換為彈出視窗'}
                    >
                        {layoutMode === 'popup' ? <PanelRight size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {/* Delete: only in edit mode for saved places */}
                    {editorMode === 'edit' && selectedPlace && places.some(p => p.id === selectedPlace.id) && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors text-gray-400"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className={cn(
                            "px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-all flex items-center gap-1.5",
                            isSubmitting && "opacity-60 cursor-wait"
                        )}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                儲存中...
                            </>
                        ) : (
                            <>
                                <Save size={14} />
                                儲存地點
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8">

                {/* Properties section */}
                <div>

                    {/* Title */}
                    <div className="mb-4">
                        <input
                            ref={nameInputRef}
                            type="text"
                            className={cn(
                                "w-full text-3xl font-bold bg-transparent border-0 outline-none placeholder:text-gray-200 text-gray-900",
                                errors.name && "placeholder:text-red-300"
                            )}
                            placeholder="地點名稱"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                if (errors.name) setErrors({ ...errors, name: undefined })
                            }}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Properties List */}
                    <div className="space-y-0 mb-4">

                        {/* Date */}
                        <div className="flex items-center py-2.5 rounded-xl -mx-2 px-2 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-2.5 w-32 shrink-0">
                                <Calendar size={15} className="text-gray-400" />
                                <span className="text-sm text-gray-500">造訪日期</span>
                            </div>
                            <input
                                type="date"
                                className="flex-1 text-sm text-gray-700 bg-transparent border-0 outline-none cursor-pointer"
                                value={visitedDate}
                                onChange={(e) => setVisitedDate(e.target.value)}
                            />
                        </div>

                        {/* Tags */}
                        <div className="flex items-start py-2.5 rounded-xl -mx-2 px-2 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2.5 w-32 shrink-0 pt-0.5">
                                <Tag size={15} className="text-gray-400" />
                                <span className="text-sm text-gray-500">標籤</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap gap-1.5 mb-1.5">
                                    {tags.map(tag => (
                                        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                            #{tag}
                                            <button onClick={() => removeTag(tag)} className="hover:text-gray-900 ml-0.5">
                                                <X size={11} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    className="w-full text-sm text-gray-700 bg-transparent border-0 outline-none placeholder:text-gray-400"
                                    placeholder={tags.length === 0 ? "新增標籤..." : "+ 更多"}
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={addTag}
                                />
                            </div>
                        </div>

                        {/* Color */}
                        <div className="flex items-center py-2.5 rounded-xl -mx-2 px-2 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2.5 w-32 shrink-0">
                                <div
                                    className="w-3.5 h-3.5 rounded-full border border-gray-300"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-sm text-gray-500">圖標顏色</span>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {PLACE_COLORS.map((c) => (
                                    <button
                                        key={c.value}
                                        onClick={() => setColor(c.value)}
                                        className={cn(
                                            "w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
                                            color === c.value ? "border-gray-900 scale-110" : "border-transparent hover:scale-105"
                                        )}
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    >
                                        {color === c.value && <Check size={11} className="text-white drop-shadow" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Photo */}
                        <div className="flex items-start py-2.5 rounded-xl -mx-2 px-2 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-2.5 w-32 shrink-0 pt-1">
                                <ImageIcon size={15} className="text-gray-400" />
                                <span className="text-sm text-gray-500">照片</span>
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                />
                                {photos.length === 0 ? (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-colors"
                                    >
                                        <Plus size={15} />
                                        新增照片
                                    </button>
                                ) : (
                                    <DraggablePhotoGrid
                                        photos={photos}
                                        onReorder={setPhotos}
                                        onRemove={removePhoto}
                                        onAddClick={() => fileInputRef.current?.click()}
                                    />
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Divider */}
                    <hr className="border-gray-100 mb-4" />

                </div>{/* end properties shrink-0 */}

                {/* Notes section */}
                <div className="min-h-[300px]">
                    <RichTextEditor content={content} onChange={setContent} />
                </div>

            </div>
        </>
    )

    if (layoutMode === 'popup') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-[1000px] rounded-3xl shadow-2xl flex flex-col h-[80vh] overflow-hidden">
                    {editorInner}
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 flex items-stretch justify-end pointer-events-none">
            <div
                className="relative flex flex-col bg-white shadow-2xl rounded-l-3xl pointer-events-auto overflow-hidden animate-in slide-in-from-right duration-200"
                style={{ width: panelWidth }}
            >
                {/* Resize handle - 左側拖曳區 */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-blue-400/30 transition-colors z-10 rounded-l-3xl"
                    onMouseDown={handleResizeStart}
                />
                {editorInner}
            </div>
        </div>
    )
}
