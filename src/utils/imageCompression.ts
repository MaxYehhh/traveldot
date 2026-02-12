import imageCompression from 'browser-image-compression'

export interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    fileType?: string;
}

export const compressImage = async (file: File, options?: CompressionOptions): Promise<File> => {
    const defaultOptions: CompressionOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    }

    try {
        const compressedFile = await imageCompression(file, { ...defaultOptions, ...options })
        return compressedFile
    } catch (error) {
        console.error('Image compression failed:', error)
        throw error
    }
}
