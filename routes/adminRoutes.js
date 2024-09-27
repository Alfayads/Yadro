const express = require('express');
const admin_router = express.Router();

const Controller = require('../controllers/adminController');
const auth = require('../middlewares/adminMiddleware');

// Login routes
admin_router.get('/login', auth.isLogout, Controller.getLogin);
admin_router.post('/login', Controller.checkLogin);

//Home route
admin_router.get('/', auth.isLogin, Controller.getHome);

//Product Route
admin_router.get('/product', auth.isLogin, Controller.getProduct);

// Add Product Route
admin_router.get('/add-product', auth.isLogin, Controller.getAddProduct);

// Category Route
admin_router.get('/category', auth.isLogin, Controller.getCategory)
admin_router.get('/add-category', auth.isLogin, Controller.getAddCategory);

// Customers Route
admin_router.get('/customers', auth.isLogin, Controller.getCustomers);

//Coupon Route
admin_router.get('/coupons', auth.isLogin, Controller.getCoupons);
admin_router.get('/add-coupon', auth.isLogin, Controller.getAddCoupon);

// All orders route
admin_router.get('/orders', auth.isLogin, Controller.getOrders);

// Brand Route
admin_router.get('/brands', Controller.getBrands);
admin_router.get('/add-brand', Controller.getAddBrand);

// Banner Route
admin_router.get('/banners', Controller.getBanners);
admin_router.get('/add-banner', Controller.getAddBanner);


//Logout Route
admin_router.get('/logout', Controller.logout);


module.exports = admin_router;