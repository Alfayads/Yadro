const bcrypt = require('bcrypt');

const Users = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');


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

// All Products

const getProduct = async (req, res) => {
    try {
        let search = req.query.search || '';
        let page = parseInt(req.query.page) || 1;

        const limit = 5;

        const productData = await Product.find({

            $or: [
                { name: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ]
        }).limit(limit).skip((page - 1) * limit).exec();

        console.log(productData)

        const count = await Product.countDocuments({

            $or: [
                { name: { $regex: search, $options: "i", } },
                { category: { $regex: search, $options: "i" } },
            ]
        });

        console.log(count)

        return res.render('admin/products', {
            data: productData,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            searchTerm: search,
        });
    } catch (error) {
        console.log(error.message)
    }
}

// Add product page

const getAddProduct = (req, res) => {
    try {
        return res.render('admin/add-product');
    } catch (error) {
        console.log(error.message);
    }
}



const addProduct = async (req, res) => {
    try {
        const { name, description, stock, price, color, brand, discount, category } = req.body;
        let findProduct = await Product.findOne({ name });
        let salePrice = price - (price * (discount / 100));
        if (findProduct) {
            req.flash('error_msg', 'Product is Already Addedd');
            return res.redirect('/admin/product');
        }
        const newProduct = await new Product({
            name,
            description,
            salePrice: Math.round(salePrice),
            quantity: stock,
            regularPrice: price,
            color, brand, discount,
            category
        });
        await newProduct.save();
        req.flash('success_msg', `${name} Product Added Successfully...`);
        res.redirect('/admin/product');
    } catch (error) {
        console.log(error.message)
    }
}

// Edit Product

const editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById({ _id: id });
        if (!product) {
            req.flash('error_msg', 'Product is Not found');
            return res.redirect('/admin/product')
        }

        return res.render('admin/editProduct', { product });
    } catch (error) {
        console.log(error.message)
    }
}

// Editted Product

const edittedProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, stock, price, color, brand, discount, category } = req.body;
        console.log(name, description)
        let salePrice = price - (price * (discount / 100));
        const newProduct = {
            name,
            description,
            salePrice: Math.round(salePrice),
            quantity: stock,
            regularPrice: price,
            color, brand, discount,
            category
        }
        await Product.updateOne(
            { _id: id },
            { $set: newProduct }
        );
        req.flash('success_msg', `${name} Editted  Successfully...`);
        res.redirect('/admin/product');
    } catch (error) {
        console.log(error.message);
    }
}


const viewProduct = async (req, res) => {
    try {
        let id = req.params.id;
        const product = await Product.findById({ _id: id });
        return res.render('admin/viewProduct', { product });
    } catch (error) {
        console.log(error.message);
    }
}

const deleteProduct = async (req, res) => {
    try {
        let id = req.params.id;
        const findProduct = await Product.findById({ _id: id });
        if (!findProduct) {
            req.flash('error_msg', 'Product is Not found Try again...');
            res.redirect('/admin/product');
        }
        await Product.deleteOne({ _id: id });
        req.flash('success_msg', `${findProduct.name} Product Deleted Successfully...`);
        return res.redirect('/admin/product')
    } catch (error) {
        console.log(error.message);
    }
}


const getCategory = async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.render('admin/category', { categories });
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

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        let existCategory = await Product.findOne({ name });
        if (existCategory) {
            req.flash('error_msg', 'Already Add This Category Try different ...');
            return res.redirect('/admin/category');
        }
        const newCategory = new Category({
            name,
            description
        })
        await newCategory.save();
        req.flash('success_msg', `${name} Category is Added Successfully...`);
        return res.redirect('/admin/category');
    } catch (error) {
        console.log(error.message);
    }
}


const getEditCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById({ _id: id });
        if (!category) {
            req.flash('error_msg', 'Category Not find !!! Try again');
            return res.redirect('/admin/category');
        }

        return res.render('admin/edit-category', { category });
    } catch (error) {
        console.log(error.message);
    }
}


const editCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description } = req.body;
        const EditCategory = {
            name,
            description
        }
        await Category.updateOne({ _id: id }, { $set: EditCategory });
        req.flash('success_msg', `${name} Category is Updated Successfully..`);
        return res.redirect('/admin/category');
    } catch (error) {
        console.log(error.message);
    }
}


const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById({ _id: id });
        await Category.deleteOne({ _id: id });
        req.flash('success_msg', `${category.name} Category is Deleted Successfully ... `);
        return res.redirect('/admin/category')
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

        const limit = 10;

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
    addProduct,
    editProduct,
    edittedProduct,
    viewProduct,
    deleteProduct,

    getCategory,
    getAddCategory,
    addCategory,
    getEditCategory,
    editCategory,
    deleteCategory,

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