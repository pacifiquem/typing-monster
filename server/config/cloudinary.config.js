const cloudinary = require('cloudinary').v2;


const cloudinaryConfiguration = () => {

    const config = cloudinary.config({ 
        cloud_name: process.env.Cloudinarycloud_name, 
        api_key: process.env.Cloudinaryapi_key, 
        api_secret: process.env.Cloudinaryapi_secret,
        secure: true
    });

    return config;
}

module.exports = cloudinaryConfiguration;