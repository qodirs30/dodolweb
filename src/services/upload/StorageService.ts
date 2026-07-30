import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase/config';
import { ProjectService } from '../project/ProjectService';

// Supported file extensions and mime types
export const ALLOWED_FILE_TYPES = {
  // Images
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'image/gif': ['.gif'],
  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
  'text/plain': ['.txt'],
  // Videos
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  // Design formats (binary or generic octet-stream)
  'application/postscript': ['.ai', '.psd'],
  'application/octet-stream': ['.ai', '.psd', '.cdr', '.fig'],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Helper to sanitize file names
export function sanitizeFileName(name: string): string {
  // Extract name and extension
  const lastDot = name.lastIndexOf('.');
  const baseName = lastDot !== -1 ? name.substring(0, lastDot) : name;
  const ext = lastDot !== -1 ? name.substring(lastDot) : '';

  const cleanBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-') // replace non-alphanumeric with hyphen
    .replace(/-+/g, '-'); // collapse consecutive hyphens

  return `${cleanBase}${ext}`;
}

// Client-side image compressor (HTML5 Canvas based)
export async function compressImage(file: File): Promise<File> {
  // Avoid compressing vector formats or files that are not images
  if (file.type === 'image/svg+xml' || file.name.endsWith('.svg') || !file.type.startsWith('image/')) {
    return file;
  }

  // Do not compress small images (< 500KB)
  if (file.size < 500 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Max dimension 1600px
        const maxDimension = 1600;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Compress as JPEG at 80% quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.8
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

export const StorageService = {
  // Validate file dimensions, size and type
  validateFile(file: File): { valid: boolean; error?: string } {
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: 'File size exceeds maximum 50MB limit.' };
    }

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    const isAllowed = Object.values(ALLOWED_FILE_TYPES).some((extensions) =>
      extensions.includes(ext)
    );

    if (!isAllowed) {
      return { valid: false, error: `File format ${ext} is not supported.` };
    }

    return { valid: true };
  },

  // Upload single file and return its storage path (downloadURL is loaded dynamically)
  async uploadFile(
    docId: string,
    projectId: string,
    file: File,
    category: string,
    uploaderName: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // 1. Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // 2. Sanitize and compress if needed
    const sanitizedName = sanitizeFileName(file.name);
    const processedFile = file.type.startsWith('image/') 
      ? await compressImage(file) 
      : file;

    // 3. Setup storage reference path
    const storagePath = `projects/${projectId}/${category}/${Date.now()}_${sanitizedName}`;
    const storageRef = ref(storage, storagePath);

    // 4. Perform upload task
    const uploadTask = uploadBytesResumable(storageRef, processedFile);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (onProgress) onProgress(progress);
        },
        (error) => {
          reject(new Error(`Firebase Storage upload failed: ${error.message}`));
        },
        async () => {
          try {
            // File uploaded, now save metadata inside subcollection "uploads" of the project document
            await ProjectService.addUploadMetadata(docId, {
              fileName: file.name,
              storagePath,
              size: processedFile.size,
              mimeType: processedFile.type || 'application/octet-stream',
              category,
              uploadedBy: uploaderName,
            });

            resolve(storagePath);
          } catch (e: any) {
            reject(new Error(`Failed saving file metadata: ${e.message}`));
          }
        }
      );
    });
  },

  // Dynamically load downloadURL from storagePath
  async getFileUrl(storagePath: string): Promise<string> {
    try {
      const storageRef = ref(storage, storagePath);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (e: any) {
      console.error('Error generating dynamic file URL:', e);
      throw new Error(`Failed generating file download link: ${e.message}`);
    }
  },

  // Delete file from storage and mark metadata as deleted in Firestore
  async deleteFile(docId: string, uploadId: string, storagePath: string, adminName: string): Promise<void> {
    try {
      // 1. Delete physical object in Cloud Storage
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);

      // 2. Soft delete metadata inside the uploads subcollection
      const uploadDocRef = doc(db, 'projects', docId, 'uploads', uploadId);
      await updateDoc(uploadDocRef, {
        status: 'deleted',
        deleted: true,
        deletedBy: adminName,
        deletedAt: serverTimestamp(),
      });

      // Write action to project history
      await addDoc(collection(db, 'projects', docId, 'history'), {
        action: 'File Deleted',
        description: `File was deleted: ${storagePath}`,
        performedBy: adminName,
        createdAt: serverTimestamp(),
      });
    } catch (e: any) {
      console.error('Error deleting file:', e);
      throw new Error(`Failed deleting file: ${e.message}`);
    }
  },
};
