const cookieParser = require('cookie-parser');

// get the token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {

    const token = user.getJsonWebToken();

    //cookie options
    const Cookie_options = {
        expire: new Date(Date.now() + process.env.cookieEpire * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res
    .status(statusCode)
    .cookie('token', token , Cookie_options)
    .json({
        success: true,
        token: token
    })

}

module.exports = sendTokenResponse