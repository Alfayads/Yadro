const express = require('express');
const user_router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
// lead Page
user_router.get('/', auth.isLogin, authController.getHomeWithoutUser)
// signup
user_router.get('/signup', auth.isLogin, authController.getSignup);
user_router.post('/signup', authController.newUser);
// login 
user_router.get('/login', auth.isLogin, authController.getLogin);
user_router.post('/login', authController.checkUser);
//logout
user_router.get('/logout', authController.getLogout);
//home
user_router.get('/home', auth.isLogout, authController.getHomeWithUser);
//otp-verification
user_router.get('/otp-verify', authController.getOtpVerify)
user_router.post('/verify-otp', authController.verifyOtp)

module.exports = user_router;