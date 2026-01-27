import React, { useCallback, useState } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
    photos: string[]
    onChange: (photos: string[]) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ photos, onChange }) => {
    const [isProcessing, setIsProcessing] = useState(false)

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (event) => {
                const img = new Image()
                img.src = event.target?.result as string
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    const MAX_WIDTH = 1200
                    const MAX_HEIGHT = 1200
                    let width = img.width
                    let height = img.height

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width
                            width = MAX_WIDTH
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height
                            height = MAX_HEIGHT
                        }
                    }

                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx?.drawImage(img, 0, 0, width, height)

                    // Compress to 0.8 quality JPEG
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
                    resolve(dataUrl)
                }
            }
        })
    }

    const onFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        setIsProcessing(true)
        try {
            const compressedResults = await Promise.all(
                Array.from(files).map(file => compressImage(file))
            )
            onChange([...photos, ...compressedResults])
        } catch (error) {
            console.error('Error compressing images:', error)
        } finally {
            setIsProcessing(false)
        }
    }, [photos, onChange])

    const removePhoto = (index: number) => {
        const newPhotos = [...photos]
        // If it's a blob URL, we should revoke it. 
        // But since we use DataURL (base64) for local compression preview in MVP, skipping revoke.
        newPhotos.splice(index, 1)
        onChange(newPhotos)
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Photos</label>

            <div className="grid grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-100 shadow-sm">
                        <img
                            src={photo}
                            alt={`Capture ${index}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <button
                            onClick={() => removePhoto(index)}
                            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer flex flex-col items-center justify-center transition-all group">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={onFileChange}
                        disabled={isProcessing}
                    />
                    {isProcessing ? (
                        <Loader2 className="text-blue-500 animate-spin" size={24} />
                    ) : (
                        <>
                            <Upload className="text-gray-400 group-hover:text-blue-500 mb-1" size={24} />
                            <span className="text-[10px] font-medium text-gray-400 group-hover:text-blue-500">Add Photo</span>
                        </>
                    )}
                </label>
            </div>
        </div>
    )
}
