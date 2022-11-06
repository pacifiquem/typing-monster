const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// config the .env file
dotenv.config = ({path: '../config/config.env'});

const userModel = mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        min: [2,'name mustbe atleast 2 characters long'],
        maxLength: [200, 'name mustbe atleast 200 characters long']
    },
    lastName: {
        type: String,
        required: true,
        min: [2,'name mustbe atleast 2 characters long'],
        maxLength: [200, 'name mustbe atleast 200 characters long']
    },
    email: {
        type: String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },
    address: {
        type: {
            country : String,
            city : String
        },
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        min: [3,'Username mustbe greater than 2 characters long'],
        maxLength: [30, 'Username mustbe less than 30 characters long'] 
    },
    password: {
        type: String,
        required: true,
        min: 6,
        maxLength: 10
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

userModel.pre('save',async function() {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword =await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

//generate logged user token
userModel.methods.getJsonWebToken = function() {
    const userId = this._id;

   return jwt.sign({id: userId}, process.env.secretKey, {
        expiresIn: '30d'
    });

}

//generate and hash password token

userModel.methods.getResetPasswordToken = function() {
    //generate a token 
    const resetToken = crypto.randomBytes(20).toString('hex');

    //hash token and set it to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // set value to resetPasswordExpire field
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
}


userModel.methods.matchPassword =async function(enteredpassword) {
    return await bcrypt.compare(enteredpassword, this.password);
}


module.exports.userModel = mongoose.model('Users', userModel);