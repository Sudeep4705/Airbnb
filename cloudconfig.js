const cloudinary = require('cloudinary').v2;
const { closeDelimiter } = require('ejs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdFormats:  ["png","jpg","jpeg"], // supports promises as well
   
    },
  });

  module.exports={
    cloudinary,storage
  }
  