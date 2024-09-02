import {v2 as cloudinary} from 'cloudinary';
import 'dotenv/config'
//configuriamo il nostro cloudinary
cloudinary.config({
    cloud_name:process.env.cloudinaryName,
    api_key:process.env.APIKeyCloudinary,
    api_secret:process.env.APISecretcloudinary
});
export default cloudinary;