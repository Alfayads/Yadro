const express = require('express');
const user_router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');


// lead Page
user_router.get('/', auth.isLogin, authController.getHomeWithoutUser)

//home
user_router.get('/home', auth.isLogout, authController.getHomeWithUser);


// signup
user_router.get('/signup', auth.isLogin, authController.getSignup);
user_router.post('/signup', authController.newUser);

//otp-verification
user_router.get('/otp-verify', auth.isLogin, authController.getOtpVerify)
user_router.post('/verify-otp', authController.verifyOtp)

// Resend Otp
user_router.post('/resend-otp', authController.resendOtp);


// login 
user_router.get('/login', auth.isLogin, authController.getLogin);
user_router.post('/login', authController.checkUser);


//logout
user_router.get('/logout', authController.getLogout);


//All products
user_router.get('/products', authController.getAllProducts);





module.exports = user_router;