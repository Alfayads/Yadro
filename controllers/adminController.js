const Users = require('../models/User');
const bcrypt = require('bcrypt');


const getHome = (req, res) => {
    try {
        res.render('admin/home');
    } catch (error) {
        console.log(error);
    }
}

const getLogin = (req, res) => {
    try {
        res.render('admin/login');
    } catch (error) {
        console.log(error)
    }
}

const checkLogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            req.flash('error_msg', 'All Fields are Required !!!');
            return res.redirect('/admin/login');
        }

        const findUser = await Users.findOne({ email });

        if (!findUser) {
            req.flash('error_msg', 'Admin Not Found!!');
            return res.redirect('/admin/login');
        }

        if (!findUser.isAdmin) {
            req.flash('error_msg', 'You are Not Admin !!');
            return res.redirect('/admin/login');
        }

        const checkPassword = await bcrypt.compare(password, findUser.password);

        if (!checkPassword) {
            req.flash('error_msg', 'Password is Incorrect Try again ...')
            return res.redirect('/admin/login')
        }

        req.session.admin = email;
        return res.redirect('/admin')


    } catch (error) {
        console.log(error.message);
    }
}


const logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.redirect('/admin/login');
            }
            return res.redirect('/admin/login');
        })
    } catch (error) {
        console.log(error.message)
    }
}

const getProduct = (req, res) => {
    try {
        return res.render('admin/products');
    } catch (error) {
        console.log(error.message)
    }
}

const getAddProduct = (req, res) => {
    try {
        return res.render('admin/add-product');
    } catch (error) {
        console.log(error.message);
    }
}

const getCategory = (req, res) => {
    try {
        return res.render('admin/category');
    } catch (error) {
        console.log(error.message)
    }
}

const getAddCategory = (req, res) => {
    try {
        return res.render('admin/add-category');
    } catch (error) {
        console.log(error.message);
    }
}

const getCustomers = (req, res) => {
    try {
        return res.render('admin/customers');
    } catch (error) {
        console.log(error.message);
    }
}

const getCoupons = (req, res) => {
    try {
        return res.render('admin/coupons');
    } catch (error) {
        console.log(error.message);
    }
}

const getAddCoupon = (req, res) => {
    try {
        return res.render('admin/add-coupon');
    } catch (error) {
        console.log(error.message);
    }
}

const getOrders = (req, res) => {
    try {
        return res.render('admin/orders');
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    getHome,
    getLogin,
    checkLogin,
    logout,
    getProduct,
    getAddProduct,
    getCategory,
    getAddCategory,
    getCustomers,
    getCoupons,
    getAddCoupon,
    getOrders
}