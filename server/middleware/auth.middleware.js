const ErrorResponse = require('../utils/errorResponse.utils');
const errorHandler = require('./errorHandler.middleware');
const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler.middleware');
const { userModel } = require('../models/userModel.model');
const dotenv = require('dotenv');

// config the .env file
dotenv.config = ({path: '../config/config.env'});

exports.protect = asyncHandler (async (req, res, next) => {

    const token = req.cookies.token;
    console.log(token);
    if(!token) {

        req.error = new ErrorResponse('you\'re not Authorized to get this route', 401);
    }
    const decoded = jwt.verify(token, process.env.secretKey);
    req.user = await userModel.findById(decoded.id);
    
    if(!req.user) {

        req.error = new ErrorResponse('you\'re not Authorized to get this route', 401);
        next(errorHandler);
    }
    next();
});