const formidable = require("formidable");
const cloudinary = require('cloudinary').v2;
const asyncHandler = require('../middleware/asyncHandler.middleware');
const cloudinaryConfiguration = require('../config/cloudinary.config');
cloudinaryConfiguration();

exports.uploadImage = asyncHandler( async(req, ImageOwner) => {

    let shoesImage = formidable({
        maxFileSize: 500000,
        multiples: false,
        keepExtensions: true, 
    })
    
    shoesImage.parse(req, async(err, fields, file) => {

        if(err) {
            return 'unable to upload image';
        }

        cloudinary.uploader.upload(file.image.filepath, async(err, result) => {

            if(err) {
                return 'unable to upload image';
            }

            ImageOwner.addImage(res.secure_url);

        });

    });
    
});