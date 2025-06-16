/**
 * Utility functions for file uploads to Supabase Storage
 */
import { supabase } from '../supabase-client/supabase-client.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Uploads a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The storage bucket name
 * @param {string} folder - The folder path within the bucket
 * @param {Function} progressCallback - Optional callback for upload progress
 * @returns {Promise<{path: string, url: string}>} - The file path and public URL
 */
export async function uploadFile(file, bucket = 'event-photos', folder = '', progressCallback = null) {
  try {
    // Generate a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: progressCallback ? 
          (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            progressCallback(percent);
          } : undefined
      });
      
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return {
      path: data.path,
      url: publicUrl
    };
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
}

/**
 * Validates a file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @param {number} options.maxSizeMB - Maximum file size in MB
 * @param {string[]} options.allowedTypes - Array of allowed MIME types
 * @returns {Object} - Validation result with isValid and message properties
 */
export function validateFile(file, options = { maxSizeMB: 5, allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] }) {
  const { maxSizeMB, allowedTypes } = options;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (!file) {
    return { isValid: false, message: 'No file selected' };
  }
  
  if (file.size > maxSizeBytes) {
    return { 
      isValid: false, 
      message: `File size exceeds the ${maxSizeMB}MB limit` 
    };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      message: `File type not allowed. Please use: ${allowedTypes.join(', ')}` 
    };
  }
  
  return { isValid: true, message: 'File is valid' };
}
