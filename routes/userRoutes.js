const express = require('express');
const user_router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
const passport = require('passport');


// lead Page
user_router.get('/', auth.isLogin, authController.getHomeWithoutUser)

//home
user_router.get('/home', auth.isLogout, authController.getHomeWithUser);

// Product Details
user_router.get('/product-detail/:id', authController.productDetails);


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


// Google Authentication
user_router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
user_router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/signup', failureFlash: true }),
    (req, res) => {
        res.redirect('/home');
    }
);


module.exports = user_router;