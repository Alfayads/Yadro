const express = require('express');
const admin_router = express.Router();

const Controller = require('../controllers/adminController');
// const auth = require('../middlewares/adminMiddleware');

const { adminAuth } = require('../middlewares/auth');

// Login routes
admin_router.get('/login', Controller.getLogin);
admin_router.post('/login', Controller.checkLogin);

//Home route
admin_router.get('/', adminAuth, Controller.getHome);

//Product Route
admin_router.get('/product', adminAuth, Controller.getProduct);

// Add Product Route
admin_router.get('/add-product', adminAuth, Controller.getAddProduct);

// Category Route
admin_router.get('/category', adminAuth, Controller.getCategory)
admin_router.get('/add-category', adminAuth, Controller.getAddCategory);

// Customers Route
admin_router.get('/customers', adminAuth, Controller.getCustomers);
admin_router.get('/blockCustomer', Controller.blockCustomer); // Block Customer
admin_router.get('/unblockCustomer', Controller.unblockCustomer); // UnBlock Customer
admin_router.get('/deleteCustomer', Controller.deleteCustomer); // Delete Customer

//Coupon Route
admin_router.get('/coupons', adminAuth, Controller.getCoupons);
admin_router.get('/add-coupon', adminAuth, Controller.getAddCoupon);

// All orders route
admin_router.get('/orders', adminAuth, Controller.getOrders);

// Brand Route
admin_router.get('/brands', adminAuth, Controller.getBrands);
admin_router.get('/add-brand', adminAuth, Controller.getAddBrand);

// Banner Route
admin_router.get('/banners', adminAuth, Controller.getBanners);
admin_router.get('/add-banner', adminAuth, Controller.getAddBanner);


//Logout Route
admin_router.get('/logout', Controller.logout);


module.exports = admin_router;