const mongoose = require('mongoose');
const crypto = require('crypto');
const asyncHandler = require('../middleware/asyncHandler.middleware');
const errorHandler = require('../middleware/errorHandler.middleware');
const ErrorResponse = require('../utils/errorResponse.utils');
const express = require('express');
const cookieParser = require('cookie-parser')
const sendEmail = require('../utils/sendEmails.utils');
const jwt = require('jsonwebtoken');
const { userModel } = require('../models/userModel.model');
const dotenv = require('dotenv');
const sendTokenResponse = require('../utils/sendTokenResponse.utils');


//config dotenv file
dotenv.config = ({path: '../config/config.env'});


// @desc            controller for getting all users from db
//@access           private
//url               localhost:2300/v1/users

exports.getAllUsers = asyncHandler(async (req, res, next) => {

    let query;
    let queryStr;
    let reqQuery = { ...req.query };
    let removedFields = ['select, limit, sort'];
    removedFields.forEach(params => delete reqQuery[params]);

    queryStr = JSON.stringify(req.query);
    queryStr  = queryStr.replace(/\b(lt| lte| gt| gte| in)\b/, match => `$${match}`);

    query = userModel.find({queryStr}, '+password');

    if(req.query.select) {
        fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if(req.query.sort) {

        sortBy = reqQuery.sort;
        query = query.sort(sortBy);
    }

    if(req.query.limit) {

        number = parseInt(req.query.limit, 10);
        query = query.limit(number)
    }

    const users = await query;
    if(!users) {
        res.status(200).send('no user found');
    }

    res.status(200).json({
        success: true,
        count: users.length, 
        data: users
    });
});

// @desc            controller for getting user by using Id
//@access           public
//url               localhost:2300/v1/users/:id

exports.getUsersbyId = asyncHandler(async (req, res, next) => {

    let user = await userModel.find(req.params.id);
    if(!user) {
        res.send({
            success: false,
            data: null
        })
    }
    res.send({
        success: true,
        data: user
    })
});


// @desc            controller for creating new users
//@access           public
//url               localhost:2300/v1/users/auth/signUp

exports.userSignUp = asyncHandler(async (req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE,PUT");


    let user = await userModel.create(req.body);
   
    //get a token and give response
    sendTokenResponse(user, 200, res);
});

// @desc            controller for user Login
//@access           public
//url               localhost:2300/v1/users/auth/logIn

exports.userLogin = asyncHandler(async (req, res, next) => {

    const {email, password} = req.body;
   
    //check if required field to logIn are available
    if((!email || !password)) {

        req.error = new ErrorResponse('invalid crentials', 401);
        next(errorHandler)
    }

    //getting user with provided credentials
    const user = await userModel.findOne({email: email}).select('+password');

    //check if User exist
    if(!user) {
        
        req.error = new ErrorResponse('invalid crentials', 401);
        next(errorHandler);
    }
    

    //check if password entered matcth the one in db
    let arePasswordsMatch = await user.matchPassword(password);
    
    if(arePasswordsMatch === false){

        req.error = new ErrorResponse('invalid password', 401);
        next(errorHandler)
    }

    // get token and send response
    sendTokenResponse(user, 200, res);

});


// @desc            controller for getting users by using Id
//@access           public
//url               localhost:2300/v1/users/:id

exports.updateUser = asyncHandler(async (req, res, next) => {

    //checking if the loggedIn user is going to update his/ accout only
    const loggedInUser = await userModel.findOne({email: req.user.email});

    if(loggedInUser._id != req.params.id) {
        res.status(401).json({
            success: false,
            message: 'you\'re not Authorized to update this user'
        });
    }else {
        let user = await userModel.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        });
        if(!user) {
            res.send({
                success: false,
                message: 'User wasn\'t updated'
            });
        }
        res.send({
            success: true,
            data: user
        });
    }
});

// @desc            controller for deleting users by using Id
//@access           private
//url               localhost:2300/v1/users/:id

exports.deleteUserbyId = asyncHandler(async (req, res, next) => {

        //checking if the loggedIn user is going to update his/ accout only
        const loggedInUser = await userModel.findOne({email: req.user.email});

        if(loggedInUser._id != req.params.id) {
            res.status(401).json({
                success: false,
                message: 'you\'re not Authorized to update this user'
            });
        }else {
            
         let user = await userModel.findByIdAndRemove(req.params.id);
            if(!user) {
                res.send({
                    success: false,
                    data: null
                })
            }
            res.send({
                success: true,
                data: user
            })
        }
});


//@desc               controller for gettings logged in user
//@access             private
//@url                localhost:2300/v1/users/getMe

exports.getMe = asyncHandler(async (req, res, next) => {

    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user.username
    });

});


//@desc               Log out the user / clear cookie
//@access             private
//@url                localhost:2300/v1/users/logout
exports.logout = asyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).send({
        success: true,
        message: "successfully logged out"
    });
});

//@desc               controller for reseting password
//@access             public
//@url                localhost:2300/v1/users/forgotPassword

exports.forgotPassword = asyncHandler(async (req, res, next) => {

    const user = await userModel.findOne({email : req.body.email});

    if(!user) {
        req.error = new ErrorResponse(`invalid credentials`, 401);
        next(errorHandler);
    }

    const resetToken = user.getResetPasswordToken();

    console.log(user.resetPasswordToken);
    if(!resetToken) {
        req.error = new ErrorResponse(`invalid credentials`, 401);
        next(errorHandler);
    }

    //sending email to the user with reset-password url

    const resetPasswordUrl = `localhost:2300/user/auth/resetPassword/${resetToken}`;
    const message = `<h1>You or (someone else) have requested for reset password</h1> \n <h2>follow the link: <a>${resetPasswordUrl}</a> </h2> \n <h3>to reset your password</h3>`;
    const subject = `Reset password link with token`;
    
    try {
        sendEmail({
            message: message,
            subject: subject,
            email: req.body.email
        });
    
        res.status(200).json({
            success: true,
            message: "email sent",
            data: user
        });
        await user.save();
        
    } catch (error) {
        resetPasswordToken = undefined;
        resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});
    } 
});


//@desc               controller for reseting password
//@access             private
//@url                localhost:2300/v1/users/auth/resetPassword/:resetToken

exports.resetPassword = asyncHandler( async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    let user = await userModel.findOne({resetPasswordToken});

    if(!user) {
        req.error = new ErrorResponse(`Either your resetToken havebeen expired or you don't have re-declare to get it`, 401);
        next(errorHandler);
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    if(!req.body.password) {
        req.error = new ErrorResponse(`please provide new password`, 304);
    }

    await user.save({
        runValidators: true
    });
    sendTokenResponse(user, 200, res);
});