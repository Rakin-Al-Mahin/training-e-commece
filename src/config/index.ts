/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    cookie_expires_in: process.env.JWT_COOKIE_EXPIRES_IN,
    refresh_cookie_expires_in: process.env.JWT_REFRESH_COOKIE_EXPIRES_IN,
    verification_secret: process.env.JWT_VERIFICATION_SECRET,
    verification_expires_in: process.env.JWT_VERIFICATION_EXPIRES_IN,
  },
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  resetlink: process.env.RESET_LINK,
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  clientBaseUrl: process.env.CLIENT_BASE_URL,
};
