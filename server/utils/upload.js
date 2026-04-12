import { uploadImage } from './cloudinary.js';
import fs from 'fs';

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await uploadImage(filePath, 'special-products');
    // Clean up the temporary file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return result.url;
  } catch (error) {
    console.error('Upload to Cloudinary failed:', error);
    throw error;
  }
};
