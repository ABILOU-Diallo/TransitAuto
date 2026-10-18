// src/lib/supabaseStorage.ts
import { supabaseAdmin } from './supabaseClient';

/**
 * Converts a base64 Data URL to a Blob
 */
export function dataURLtoBlob(dataurl: string): Blob {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Uploads an image (File, Blob, or Data URL) directly to the public 'vehicles' Supabase Storage bucket.
 * Returns the permanent public CDN URL.
 */
export async function uploadVehicleImageToStorage(
  imageInput: File | Blob | string,
  prefix = 'vehicule'
): Promise<string> {
  try {
    let fileBody: Blob | File;
    let extension = 'jpg';
    let contentType = 'image/jpeg';

    if (typeof imageInput === 'string') {
      if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
        // Already a hosted URL (e.g. Unsplash or already uploaded to storage), return as is
        return imageInput;
      }
      if (imageInput.startsWith('data:')) {
        fileBody = dataURLtoBlob(imageInput);
        const mime = imageInput.match(/data:(.*?);/)?.[1] || 'image/jpeg';
        contentType = mime;
        if (mime.includes('png')) extension = 'png';
        else if (mime.includes('webp')) extension = 'webp';
      } else {
        return imageInput;
      }
    } else if (imageInput instanceof File) {
      fileBody = imageInput;
      contentType = imageInput.type || 'image/jpeg';
      const parts = imageInput.name.split('.');
      if (parts.length > 1) extension = parts.pop() || 'jpg';
    } else {
      fileBody = imageInput;
      contentType = imageInput.type || 'image/jpeg';
    }

    const uniqueId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const fileName = `${prefix}-${uniqueId}.${extension}`;

    const { error } = await supabaseAdmin.storage
      .from('vehicles')
      .upload(fileName, fileBody, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn('Erreur téléversement Storage Supabase, fallback dataUrl:', error);
      if (typeof imageInput === 'string') return imageInput;
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('vehicles').getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.warn('Exception uploadVehicleImageToStorage, fallback:', err);
    if (typeof imageInput === 'string') return imageInput;
    throw err;
  }
}
