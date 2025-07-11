import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

cloudinary.config({
  cloud_name: env.cloud_name,
  api_key: env.cloudinary_api_key,
  api_secret: env.cloudinary_secret,
});

export default cloudinary;
