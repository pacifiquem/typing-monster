const mongoose = require('mongoose');
const shoesModel = require('../models/shoesModel.model.js');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const {  uploadImage } = require('../utils/uploadImage.utils');


exports.addShoes = asyncHandler ( async(req, res, next) => {

    const newShoes = await shoesModel.create({
        name: 'pacifique', 
        brand: 'murangwa', 
        price: 1000
    });
});