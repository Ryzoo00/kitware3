import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to read fresh env values directly from file
function getFreshEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  const content = fs.readFileSync(envPath, 'utf8');
  const vars = {};
  content.split('\n').forEach(line => {
    const eq = line.indexOf('=');
    if (eq > 0) {
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      val = val.replace(/^['"]|['"]$/g, '');
      vars[key] = val;
    }
  });
  return vars;
}

const env = getFreshEnv();
// Credentials logging removed for security

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
});

export const uploadImage = async (filePath, folder = 'products') => {
  try {
    // Get fresh config before each upload
    const fresh = getFreshEnv();
    
    // Force reconfig
    cloudinary.config({
      cloud_name: fresh.CLOUDINARY_CLOUD_NAME,
      api_key: fresh.CLOUDINARY_API_KEY,
      api_secret: fresh.CLOUDINARY_API_SECRET,
      secure: true
    });
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `ecommerce/${folder}`,
      use_filename: true,
      unique_filename: true,
    });
    
    console.log('✅ Upload success:', result.secure_url);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log('✅ Deleted:', publicId);
  } catch (error) {
    console.error('❌ Delete error:', error.message);
    throw error;
  }
};

export { cloudinary };
