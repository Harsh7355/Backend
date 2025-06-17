import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// ✅ Configuration with proper strings
cloudinary.config({ 
  cloud_name:"dxnfzhyfq", 
  api_key:"745311878543846", 
  api_secret:"aagRLHsyDXonsrLvugzZnJO_Cm0",
});
// console.log("ENV CHECK:", process.env.CLOUIDNARY_NAME);

const uploadonclouidnary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // console.log("file is uploaded on cloudinary", response.url);
  
    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    fs.unlinkSync(localFilePath);
    return null;
  }
};

export default uploadonclouidnary;
