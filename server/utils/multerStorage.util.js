const multer = require('multer');


const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
      if(file.fieldname === 'profilePicture') {
        cb(null, './uploads/profilePictures');
      }
    }, 
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }

});

module.exports.storage = storage;