import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'roomfinder/rooms',
    format: async (req, file) => 'jpg',
    public_id: (req, file) => {
      const timestamp = Date.now();
      return `room_${timestamp}`;
    },
    transformation: [
      { width: 1200, height: 800, crop: 'limit' },
      { quality: 'auto' },
      { format: 'jpg' }
    ]
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadRoomImages = upload.array('images', 10); // Max 10 images

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};