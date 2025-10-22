import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

/**
 * Get the persistent directory path for storing images
 * iOS: DocumentDirectoryPath (backed up to iCloud, persists across app updates)
 * Android: DocumentDirectoryPath (internal storage, persists across app updates)
 */
const getImageStorageDirectory = () => {
  return `${RNFS.DocumentDirectoryPath}/assets/phrase_images`;
};

/**
 * Initialize the image storage directory
 * Creates the directory if it doesn't exist
 */
export const initImageStorage = async () => {
  const dir = getImageStorageDirectory();
  const exists = await RNFS.exists(dir);
  
  if (!exists) {
    await RNFS.mkdir(dir);
    console.log('Image storage directory created:', dir);
  }
  
  return dir;
};

/**
 * Normalize URI to handle different formats
 * Handles: content://, file://, and plain paths
 */
const normalizeUri = (uri) => {
  if (!uri) return null;
  
  // Already a content:// URI (Android provider) - don't modify
  if (uri.startsWith('content://')) {
    return uri;
  }
  
  // Remove file:// prefix for file operations
  if (uri.startsWith('file://')) {
    return uri.substring(7);
  }
  
  // Plain path
  return uri;
};

/**
 * Save an image to persistent storage
 * Handles content://, file://, and regular paths
 * @param {string} sourceUri - The source URI of the image (from camera or gallery)
 * @param {string} customFileName - Optional custom filename (without extension)
 * @param {string} mimeType - Optional MIME type for better extension detection
 * @returns {Promise<string>} - The persistent file URI
 */
export const saveImageToPersistentStorage = async (sourceUri, customFileName = null, mimeType = null) => {
  try {
    if (!sourceUri) {
      throw new Error('Source URI is required');
    }

    // Ensure storage directory exists
    await initImageStorage();
    
    // Generate a unique filename if not provided
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const extension = getFileExtension(sourceUri, mimeType);
    const fileName = customFileName 
      ? `${customFileName}_${timestamp}.${extension}`
      : `phrase_image_${timestamp}_${random}.${extension}`;
    
    const destPath = `${getImageStorageDirectory()}/${fileName}`;
    
    // Handle different URI formats
    let sourcePath = sourceUri;
    
    if (sourceUri.startsWith('content://')) {
      // Android content:// URI - RNFS can handle these directly
      console.log('Copying from content:// URI:', sourceUri);
      await RNFS.copyFile(sourceUri, destPath);
    } else {
      // file:// or plain path
      sourcePath = normalizeUri(sourceUri);
      console.log('Copying from file path:', sourcePath);
      
      // Verify source exists before copying
      const sourceExists = await RNFS.exists(sourcePath);
      if (!sourceExists) {
        throw new Error(`Source file does not exist: ${sourcePath}`);
      }
      
      await RNFS.copyFile(sourcePath, destPath);
    }
    
    console.log('Image saved to persistent storage:', destPath);
    
    // Return the file URI (with file:// prefix for React Native Image component)
    return Platform.OS === 'ios' ? destPath : `file://${destPath}`;
  } catch (error) {
    console.error('Error saving image to persistent storage:', error);
    console.error('Source URI:', sourceUri);
    throw error;
  }
};

/**
 * Delete an image from persistent storage
 * @param {string} imageUri - The URI of the image to delete
 * @returns {Promise<boolean>} - True if deleted successfully
 */
export const deleteImageFromStorage = async (imageUri) => {
  try {
    if (!imageUri) return false;
    
    // Only delete if it's from our persistent storage (not content:// or cache)
    if (!isPersistentImage(imageUri)) {
      console.log('Not a persistent image, skipping deletion:', imageUri);
      return false;
    }
    
    // Normalize the URI
    const cleanUri = normalizeUri(imageUri);
    
    // Check if file exists
    const exists = await RNFS.exists(cleanUri);
    
    if (exists) {
      await RNFS.unlink(cleanUri);
      console.log('Image deleted from persistent storage:', cleanUri);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting image from storage:', error);
    return false;
  }
};

/**
 * Check if a URI is a persistent storage path (not cache or content://)
 * @param {string} uri - The URI to check
 * @returns {boolean}
 */
export const isPersistentImage = (uri) => {
  if (!uri) return false;
  // content:// URIs are not our persistent images
  if (uri.startsWith('content://')) return false;
  const cleanUri = normalizeUri(uri) || '';
  return cleanUri.includes('phrase_images');
};

/**
 * Get the file extension from a URI
 * Handles content://, file://, and regular paths
 * @param {string} uri - The file URI
 * @param {string} mimeType - Optional MIME type from image picker
 * @returns {string} - The file extension (default: 'jpg')
 */
const getFileExtension = (uri, mimeType = null) => {
  if (!uri) return 'jpg';
  
  // Try to get extension from MIME type first (most reliable for content:// URIs)
  if (mimeType) {
    const mimeToExt = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/heic': 'heic',
      'image/heif': 'heif',
    };
    const ext = mimeToExt[mimeType.toLowerCase()];
    if (ext) return ext;
  }
  
  // For content:// and file:// URIs, try to extract extension from the end
  const uriLower = uri.toLowerCase();
  const extensionMatch = uriLower.match(/\.([a-z0-9]+)(?:\?|$|#)/i);
  
  if (extensionMatch) {
    const ext = extensionMatch[1];
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic', 'heif'].includes(ext)) {
      return ext;
    }
  }
  
  // Default to jpg (most compatible)
  return 'jpg';
};

/**
 * Get all stored images
 * @returns {Promise<Array>} - Array of image file paths
 */
export const getAllStoredImages = async () => {
  try {
    await initImageStorage();
    const dir = getImageStorageDirectory();
    const files = await RNFS.readDir(dir);
    
    return files
      .filter(file => file.isFile())
      .map(file => Platform.OS === 'ios' ? file.path : `file://${file.path}`);
  } catch (error) {
    console.error('Error reading stored images:', error);
    return [];
  }
};

/**
 * Clean up orphaned images (images not referenced in your data)
 * @param {Array<string>} usedImageUris - Array of image URIs currently in use
 * @returns {Promise<number>} - Number of images deleted
 */
export const cleanupOrphanedImages = async (usedImageUris) => {
  try {
    const allImages = await getAllStoredImages();
    const usedSet = new Set(
      usedImageUris
        .filter(uri => uri && isPersistentImage(uri))
        .map(uri => normalizeUri(uri))
    );
    
    let deletedCount = 0;
    
    for (const imageUri of allImages) {
      const cleanUri = normalizeUri(imageUri);
      if (!usedSet.has(cleanUri)) {
        await deleteImageFromStorage(imageUri);
        deletedCount++;
      }
    }
    
    console.log(`Cleaned up ${deletedCount} orphaned images`);
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up orphaned images:', error);
    return 0;
  }
};

/**
 * Get storage statistics
 * @returns {Promise<Object>} - Storage info including total size and file count
 */
export const getStorageStats = async () => {
  try {
    const images = await getAllStoredImages();
    let totalSize = 0;
    
    for (const imageUri of images) {
      const cleanUri = normalizeUri(imageUri);
      const stat = await RNFS.stat(cleanUri);
      totalSize += stat.size;
    }
    
    return {
      fileCount: images.length,
      totalSizeBytes: totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {
      fileCount: 0,
      totalSizeBytes: 0,
      totalSizeMB: '0.00',
    };
  }
};
