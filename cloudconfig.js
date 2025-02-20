const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDAPI_KEY,
    api_secret: process.env.CLOUDAPI_SECRET
});



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlust-dev',
      allowedformats:["png","jpeg","jpg"], // supports promises as well
    },
  });
  module.exports={
    cloudinary,storage
  }