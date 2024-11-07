const express = require('express');
const user_router = express.Router();
const passport = require('passport');

const Order = require('../models/Order');
const Wallet = require('../models/wallet')


const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');
const { getAddress, addAddress, editAddress, getAddAddress, getEditAddress, deleteAddress, addAddressFromCheckout } = require('../controllers/addressController');
const { productDetails, getProductByCategory, getAllProducts } = require('../controllers/productController');
const { getCart, addToCart, deleteCart, getCartCount, getCheckOut, orderTracking, placeOrder, orderConfirm, updateQuantity } = require('../controllers/cartController');
const { getWishList, addWishlist, removeWishlist, getWishlistCount } = require('../controllers/wishlistController');
const { getAccount, getWallet, getTransactionHistory, getContact, editProfile, filterProducts, getWalletDetails } = require('../controllers/userController');
const { getOrders, cancelOrder, getOrderReturn, createReturn } = require('../controllers/orderController');
const { applyCoupon } = require('../controllers/couponController');
const { createOrder, verifyPayment } = require('../controllers/payments.controller');
const { downloadInvoice } = require('../controllers/invoiceController');


// lead Page
user_router.get('/', auth.isLogin, authController.getHomeWithoutUser)

// Search
user_router.get('/search', authController.userSearch);

//home
user_router.get('/home', auth.isLogout, authController.getHomeWithUser);

//All products
user_router.get('/products', auth.isLogout, getAllProducts);

// Product Details
user_router.get('/product-detail/:id', auth.isLogout, productDetails);

// product Sort by Category
user_router.get('/products/category/:id', auth.isLogout, getProductByCategory)


// Cart
user_router.get('/cart', auth.isLogout, getCart);
user_router.post('/cart/add', auth.isLogout, addToCart);
user_router.post('/cart/delete', auth.isLogout, deleteCart);
user_router.get('/cart/count', auth.isLogout, getCartCount);

// Wishlist
user_router.get('/wishlist', auth.isLogout, getWishList);
user_router.post('/wishlist/add', auth.isLogout, addWishlist);
user_router.delete('/wishlist/remove', auth.isLogout, removeWishlist);
user_router.get('/wishlist/count', auth.isLogout, getWishlistCount);


// Check Out
user_router.get('/cart/check-out', auth.isLogout, getCheckOut);
user_router.post('/cart/update-quantity', updateQuantity);
user_router.post('/place-order', placeOrder)
user_router.get('/order-confirmation/:id', orderConfirm);

// Coupon
user_router.post('/apply-coupon', applyCoupon);

// Order Tracking
user_router.get('/order-tracking/:id', auth.isLogout, orderTracking);

// All Orders page
user_router.get('/orders', auth.isLogout, getOrders);
user_router.post('/order/cancel/:id', cancelOrder)
user_router.get('/order/return/:id', getOrderReturn);
user_router.post('/order/return/:orderId', createReturn);


// Account
user_router.get('/account', auth.isLogout, getAccount);
user_router.post('/account/editProfile/:id', editProfile)

// Wallet 
user_router.get('/wallet', auth.isLogout, getWallet);
user_router.get('/wallet', auth.isLogout, getWalletDetails);

// Transaction History
user_router.get('/wallet/history', auth.isLogout, getTransactionHistory);

// address Book
user_router.get('/address', auth.isLogout, getAddress);
user_router.get('/profile/add-address', getAddAddress);
user_router.post('/profile/add-address', addAddress);
user_router.post('/profile/add-address-checkout', addAddressFromCheckout);
user_router.get('/profile/edit-address/:id', getEditAddress);
user_router.post('/profile/edit-address/:id', editAddress);
user_router.post('/profile/delete-address/:id', deleteAddress);


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
user_router.get('/forgot-password', auth.isLogout, authController.forgotPassword);
user_router.post('/reset-password', authController.resetPassword)



//logout
user_router.get('/logout', authController.getLogout);



// Contact Page
user_router.get('/contact', auth.isLogout, getContact)

// Razorpay

user_router.post('/createOrder', createOrder);
// user_router.post('/verifyPayment', verifyPayment);


// Invoice Route
user_router.get('/order/invoice/:id', downloadInvoice);


// Google Authentication
user_router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
)
user_router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/signup', failureFlash: true }),
    async (req, res) => {
        if (req.user) {
            const newWallet = new Wallet({
                userId: req.user._id,
                balance: 0,
                transactions: []
            });

            await newWallet.save();
            req.session.user_id = req.user._id;
            res.redirect('/home');
        } else {
            console.log('Google auth successful, but user object is missing');
            res.redirect('/login');
        }
    }
);






module.exports = user_router;