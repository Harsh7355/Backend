import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'


    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUIDNARY_NAME, 
        api_key: process.env.CLOUIDNARY_API_KEY, 
        api_secret: process.env.CLOUIDNARY_API_SECRET_KEY,
    });

    
    const uploadonclouidnary = async (localFilePath)=>{
        try{
           if(!localFilePath){
            return null
           }

           //upload the file on clouidnary
           const response = await cloudinary.uploader.upload(localFilePath,{
              resource_type:"auto"
           })

           //file has been uploaded successfully
           console.log("file is uploaded on cloudinary", response.url);
           return response;
        }catch(error){
           fs.unlinkSync(localFilePath) //remove the locally path 
           return null;
        }

    }
    
    export default uploadonclouidnary;
    
