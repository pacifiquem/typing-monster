const mongoose = require('mongoose');

const shoesModel = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        maxLength: [40, 'Shoe\' name must be less than 40 characters']
    },

    price: {
        type: Number,
        require: true,
        min: 0
    },

    brand: {
        type: String,
        required: true,
        required: true
    },

    image: {
        type: String, 
        match: '/((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi'
    },

    rating: {
        type: Number,
        default: 0
    }

});

shoesModel.methods.addImage = function(imageUrl) {
    this.image = imageUrl;
}

module.exports.shoesModel = mongoose.model('Shoes', shoesModel);