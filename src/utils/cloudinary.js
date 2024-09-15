import { v2 as cloudinary} from "cloudinary";
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (LocalFilePath) =>{
    try {
        if(!LocalFilePath) return null;

        // Upload the file in Cloudinary
        const response = await cloudinary.uploader.upload(LocalFilePath, {
            resource_type:"auto"
        })

        // File has been uploaded successfully
        console.log("File is Uploaded on Cloudinary !!", response.url);
        
        return response;
    } catch (error) {
        fs.unlinkSync(LocalFilePath)  //Remove the locally saved temporary file as the upload operation get failed

        return null;
    }
}

export {uploadCloudinary}