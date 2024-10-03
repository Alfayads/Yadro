const express = require('express');
const admin_router = express.Router();
const upload = require('../config/multer');

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
admin_router.get('/add-product', adminAuth, Controller.getAddProduct);// for getting add product page
admin_router.post('/add-product', upload.array('productImage', 4), Controller.addProduct) // for Adding new product
admin_router.get('/editProduct/:id', Controller.editProduct); //  for getting edit product page
admin_router.post('/edittedProduct/:id', upload.array('productImage', 4), Controller.edittedProduct) // for editted product route
admin_router.get('/viewProduct/:id', Controller.viewProduct); // for view the product
admin_router.get('/deleteProduct/:id', Controller.deleteProduct); // for delete the product

// Category Route
admin_router.get('/category', adminAuth, Controller.getCategory) // for get Category page
admin_router.get('/add-category', adminAuth, Controller.getAddCategory);// for get add Category page
admin_router.post('/add-category', Controller.addCategory);
admin_router.get('/edit-category/:id', Controller.getEditCategory) // for get edit Category page
admin_router.post('/edit-category/:id', Controller.editCategory); // Add edit Category
admin_router.get('/delete-category/:id', Controller.deleteCategory); // for Delete category
admin_router.get('/viewCategory/:id', Controller.viewCategory)

// Customers Route
admin_router.get('/customers', adminAuth, Controller.getCustomers); // for get customer page
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