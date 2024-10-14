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
user_router.get('/product-detail/:id', auth.isLogout, authController.productDetails);

// product Sort by Category
user_router.get('/products/category/:id', auth.isLogout, authController.getProductByCategory)


// Cart
user_router.get('/cart', auth.isLogout, authController.getCart);

// Wishlist
user_router.get('/wishlist', auth.isLogout, authController.getWishList);
user_router.post('/wishlist/add', auth.isLogout, authController.addWishlist);
user_router.get('/wishlist/count', auth.isLogout, authController.getWishlistCount);


// Check Out
user_router.get('/cart/check-out', auth.isLogout, authController.getCheckOut);

// Order Tracking
user_router.get('/order-tracking', auth.isLogout, authController.orderTracking);

// All Orders page
user_router.get('/orders', auth.isLogout, authController.getOrders);

// Account
user_router.get('/account', auth.isLogout, authController.getAccount);

// Wallet 
user_router.get('/wallet', auth.isLogout, authController.getWallet);

// Transaction History
user_router.get('/wallet/history', auth.isLogout, authController.getTransactionHistory);

// address Book
user_router.get('/address', auth.isLogout, authController.getAddress);


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

// Forgot Password
user_router.get('/forgot-password', authController.forgotPassword);


//logout
user_router.get('/logout', authController.getLogout);


//All products
user_router.get('/products', auth.isLogout, authController.getAllProducts);


// Contact Page
user_router.get('/contact', auth.isLogout, authController.getContact)

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