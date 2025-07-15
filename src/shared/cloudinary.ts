/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { z } from 'zod';
import config from '../config';
import { CloudinaryUploadFile } from '../interfaces/cloudinaryUpload';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
  secure: true, // Ensure HTTPS
});

// Multer storage configuration
export const storage = multer.memoryStorage();

// File filter for multer
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(
      new Error(
        'Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.'
      ) as any,
      false
    );
  } else {
    callback(null, true);
  }
};

// Zod schema for file validation
export const cloudinaryUploadFileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  buffer: z.instanceof(Buffer),
  size: z
    .number()
    .positive()
    .max(5 * 1024 * 1024), // 5MB max size
});

// Validate Cloudinary upload file
export const validateCloudinaryUploadFile = (
  file: CloudinaryUploadFile
): void => {
  try {
    cloudinaryUploadFileSchema.parse(file);
  } catch (error) {
    throw new Error(
      error instanceof z.ZodError
        ? error.errors.map(e => e.message).join(', ')
        : 'Invalid file format'
    );
  }
};

// Upload files to Cloudinary
export const uploadToCloudinary = async (
  files: CloudinaryUploadFile[]
): Promise<{ public_id: string; secure_url: string }[]> => {
  // Validate each file before processing
  files.forEach(validateCloudinaryUploadFile);

  const uploadPromises = files.map(file => {
    return new Promise<{ public_id: string; secure_url: string }>(
      (resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          {
            folder: 'user-profiles',
            transformation: [
              { width: 500, height: 500, crop: 'limit' }, // Resize images
              { quality: 'auto:best' }, // Optimize quality
            ],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (!result) {
              reject(new Error('Cloudinary upload returned no result'));
            } else {
              resolve({
                public_id: result.public_id,
                secure_url: result.secure_url,
              });
            }
          }
        );

        upload_stream.end(file.buffer);
      }
    );
  });

  try {
    const uploadedFiles = await Promise.all(uploadPromises);
    return uploadedFiles;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(
      `Failed to upload images to Cloudinary: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

// Delete files from Cloudinary
export const deleteCloudinaryFiles = async (
  publicIds: string[]
): Promise<void> => {
  const deletePromises = publicIds.map(publicId => {
    return new Promise<void>((resolve, reject) => {
      if (!publicId) return resolve();

      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          reject(error);
        } else if (result?.result !== 'ok') {
          reject(new Error(`Failed to delete file ${publicId}`));
        } else {
          resolve();
        }
      });
    });
  });

  try {
    await Promise.all(deletePromises);
  } catch (error: unknown) {
    console.error('Cloudinary delete error:', error);
    throw new Error(
      `Error deleting Cloudinary files: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

// export const extractPublicIdFromUrl = (url: string): string | null => {
//   const matches = url.match(/user-profiles\/([^/]+)$/);
//   return matches ? matches[1].split('.')[0] : null;
// };

export const extractPublicIdFromUrl = (url: string): string | null => {
  const matches = url.match(/user-profiles\/([^/.]+)/);
  return matches ? `user-profiles/${matches[1]}` : null;
};
