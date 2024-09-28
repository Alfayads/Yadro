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

// Customer Controllerr

const getCustomers = async (req, res) => {
    try {
        let search = req.query.search || '';
        let page = parseInt(req.query.page) || 1;
        let currentStatus = req.query.status || '';

        let query = {
            isAdmin: false
        };

        // Add status filter to the query
        if (currentStatus === 'blocked') {
            query.isBlocked = true;
        } else if (currentStatus === 'active') {
            query.isBlocked = false;
        }

        const limit = 5;

        const userData = await Users.find({
            ...query,
            $or: [
                { fname: { $regex: search, $options: "i" } },
                { lname: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ]
        }).limit(limit).skip((page - 1) * limit).exec();

        const count = await Users.countDocuments({
            ...query,
            $or: [
                { fname: { $regex: search, $options: "i" } },
                { lname: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
            ]
        });

        return res.render('admin/customers', {
            data: userData,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            searchTerm: search,
            currentStatus
        });
    } catch (error) {
        console.log(error.message);
    }
}


// Block Customer

const blockCustomer = async (req, res) => {
    try {
        let id = req.query.id;
        const findUser = await Users.findById({ _id: id });
        await Users.updateOne({ _id: id }, { $set: { isBlocked: true } });
        req.flash('success_msg', `${findUser.fname} ${findUser.lname} is Blocked Successfully ...`)
        return res.redirect('/admin/customers');
    } catch (error) {
        console.error('Error blocking customer:', error); // Log the error
        req.flash('error_msg', 'An error occurred while blocking the user.');
        res.redirect('/admin/customers');
    }
}

// UnBlock Customer

const unblockCustomer = async (req, res) => {
    try {
        let id = req.query.id;
        const findUser = await Users.findById({ _id: id });
        await Users.updateOne({ _id: id }, { $set: { isBlocked: false } });
        req.flash('success_msg', `${findUser.fname} ${findUser.lname} is Unblocked Successfully ...`)
        return res.redirect('/admin/customers');
    } catch (error) {
        console.error('Error blocking customer:', error); // Log the error
        req.flash('error_msg', 'An error occurred while blocking the user.');
        res.redirect('/admin/customers');
    }
}

// Delete Customer 

const deleteCustomer = async (req, res) => {
    try {
        let id = req.query.id;
        const findUser = await Users.findById({ _id: id });
        req.flash('success_msg', `${findUser.fname} ${findUser.lname} is Deleted Successfully ...`)
        await Users.deleteOne({ _id: id });
        return res.redirect('/admin/customers');
    } catch (error) {
        console.error('Error blocking customer:', error); // Log the error
        req.flash('error_msg', 'An error occurred while blocking the user.');
        res.redirect('/admin/customers');
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

const getBrands = (req, res) => {
    try {
        return res.render('admin/brand');
    } catch (error) {
        console.log(error.message);
    }
}

const getAddBrand = (req, res) => {
    try {
        return res.render('admin/add-brand');
    } catch (error) {
        console.log(error.message);
    }
}

const getBanners = (req, res) => {
    try {
        return res.render('admin/banner');
    } catch (error) {
        console.log(error.message);
    }
}

const getAddBanner = (req, res) => {
    try {
        return res.render('admin/add-banner');
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
    blockCustomer,
    unblockCustomer,
    deleteCustomer,
    getCoupons,
    getAddCoupon,
    getOrders,
    getBrands,
    getAddBrand,
    getBanners,
    getAddBanner
}