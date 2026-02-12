import { compressImage } from "@/utils/imageCompression";

const CLOUDINARY_CLOUD_NAME = "dujupddme";
const CLOUDINARY_UPLOAD_PRESET = "Traveldot";

export const uploadPhoto = async (
    userId: string,
    tripId: string,
    file: File,
    onProgress?: (progress: number) => void
): Promise<string> => {
    // 1. Compress image
    const compressedFile = await compressImage(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
    });

    // 2. Build FormData
    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", `traveldot/${userId}/${tripId}`);

    // 3. Upload via XHR to support progress callback
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                onProgress?.(progress);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response.secure_url);
            } else {
                reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));

        xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
        );
        xhr.send(formData);
    });
};

export const deletePhoto = async (photoURL: string): Promise<void> => {
    // Cloudinary 刪除需要 server-side 簽名（api_secret 不能放前端）
    // 目前為 no-op，照片會留在 Cloudinary，不影響前端使用
    console.warn("deletePhoto: Cloudinary 刪除需後端支援，暫略。", photoURL);
};
