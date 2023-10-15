require('dotenv').config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || 'dxkdzjsnd',
  api_key: process.env.CLOUDINARY_KEY || '747595146714676',
  api_secret:
    process.env.CLOUDINARY_KEY_SECRET || 'OtaUnJgd7xVrNxsr0feNWgYMGuA',
});

export default cloudinary;
