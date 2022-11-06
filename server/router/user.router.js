const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

const {
    getAllUsers,
    getUsersbyId,
    userSignUp,
    userLogin,
    updateUser,
    deleteUserbyId,
    getMe,
    forgotPassword,
    resetPassword,
    logout

} = require('../controllers/user.controller')

router
    .route('/')
    .get(getAllUsers)
    .delete()

//http://localhost:2300//v1/users/getMe
//smtp.mailtrap.io

router
    .route('/getMe')
    .get(protect,getMe)

//http://localhost:2300//v1/users/auth/signUp

router
    .route('/auth/signUp')
    .post(userSignUp)

//http://localhost:2300//v1/users/auth/logIn

router
    .route('/auth/logIn')
    .post(userLogin)

//http://localhost:2300//v1/users/auth/forgotpassword

router
    .route('/auth/forgotpassword')
    .post(forgotPassword)

//http://localhost:2300//v1/users/auth/resetPassword/:resetToken

router
    .route('/auth/resetPassword/:resetToken')
    .put(resetPassword)

//http://localhost:2300//v1/users/auth/logout

router
    .route('/auth/logout')
    .post(protect, logout)

router
    .route('/:id')
    .put(protect, updateUser)
    .get(protect, getUsersbyId)
    .delete(protect, deleteUserbyId)

module.exports = router;