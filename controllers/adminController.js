const bcrypt = require('bcrypt');
const path = require('path');

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
            ]
        }).limit(limit).skip((page - 1) * limit).exec();

        const count = await Product.countDocuments({
            $or: [
                { name: { $regex: search, $options: "i", } },
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

const getAddProduct = async (req, res) => {
    try {
        const categories = await Category.find({});
        return res.render('admin/add-product', { categories });
    } catch (error) {
        console.log(error.message);
    }
}



const addProduct = async (req, res) => {
    try {
        const { name, description, brand, price, category, quantity, color, discount } = req.body;

        if (!name || !description || !brand || !color || !category || !quantity || !discount || !price) {
            req.flash('error_msg', 'Please provide all required fields');
            return res.redirect('/admin/add-product');
        }

        let findProduct = await Product.findOne({ name });
        if (findProduct) {
            req.flash('error_msg', 'Product Already Exists');
            return res.redirect('/admin/add-product');
        }

        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            req.flash('error_msg', 'Invalid category');
            return res.redirect('/admin/add-product');
        }

        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => `/products/${file.filename}`);
        }

        const newProduct = new Product({
            name,
            description,
            brand,
            regularPrice: price,
            salePrice: (price - (price * (discount / 100))),
            productOffer: discount,
            category: categoryDoc._id,
            quantity: parseInt(quantity),
            color,
            status: parseInt(quantity) > 0 ? "Available" : "Out Of Stock",
            images: imagePaths
        });

        await newProduct.save();
        req.flash('success_msg', `${name} Product Added Successfully`);
        res.redirect('/admin/product');

    } catch (error) {
        console.error('Error adding product:', error);
        req.flash('error_msg', 'An error occurred while adding the product');
        res.redirect('/admin/add-product');
    }
};
// Edit Product

const editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById({ _id: id });
        const category = await Category.findById({ _id: product.category });
        const categories = await Category.find({});
        if (!product) {
            req.flash('error_msg', 'Product is Not found');
            return res.redirect('/admin/product')
        }

        return res.render('admin/editProduct', { product, category, categories });
    } catch (error) {
        console.log(error.message)
    }
}

// Editted Product

const edittedProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, description, stock: quantity, price, color, brand, discount, category } = req.body;

        // Check if quantity is valid
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity)) {
            req.flash('error_msg', 'Quantity must be a valid number');
            return res.redirect(`/admin/product`);
        }

        // Validate price
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
            req.flash('error_msg', 'Price must be a valid number');
            return res.redirect(`/admin/edit-product/${id}`);
        }

        // Validate category
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            req.flash('error_msg', 'Invalid category');
            return res.redirect('/admin/add-product');
        }

        // Fetch the existing product
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            req.flash('error_msg', 'Product not found');
            return res.redirect('/admin/product');
        }

        // Handle image uploads
        let imagePaths = existingProduct.images; // Start with existing images
        if (req.files && req.files.length > 0) {
            // Delete old images
            existingProduct.images.forEach(imagePath => {
                const fullPath = path.join(__dirname, '../public/', imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });

            // Add new image paths
            imagePaths = req.files.map(file => `/products/${file.filename}`);
        }

        const updatedProduct = {
            name,
            description,
            brand,
            regularPrice: parsedPrice,
            salePrice: (parsedPrice - (parsedPrice * (discount / 100))),
            category: categoryDoc._id,
            productOffer: discount,
            quantity: parsedQuantity,
            color,
            status: parsedQuantity > 0 ? "Available" : "Out Of Stock",
            images: imagePaths
        };

        await Product.updateOne({ _id: id }, { $set: updatedProduct });
        req.flash('success_msg', `${name} Edited Successfully...`);
        return res.redirect('/admin/product');
    } catch (error) {
        console.log(error.message);
    }
}


const viewProduct = async (req, res) => {
    try {
        let id = req.params.id;

        const product = await Product.findById({ _id: id });
        const categories = await Category.findById({ _id: product.category });
        return res.render('admin/viewProduct', { product, categories });
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

        let search = req.query.search || '';
        let page = parseInt(req.query.page) || 1;

        const limit = 5;

        const categoryData = await Category.find({

            $or: [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        }).limit(limit).skip((page - 1) * limit).exec();

        console.log(categoryData)

        const count = await Category.countDocuments({

            $or: [
                { name: { $regex: search, $options: "i", } },
                { description: { $regex: search, $options: "i" } },
            ]
        });

        console.log(count)

        return res.render('admin/category', {
            currentPage: page,
            categories: categoryData,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            searchTerm: search,
        });
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
        const { name, description, offer, isActive } = req.body;

        // Check if category already exists
        let existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            req.flash('error_msg', 'This category already exists. Try a different name.');
            return res.redirect('/admin/category');
        }

        const newCategory = {
            name,
            description,
            categoryOffer: offer,
            isListed: isActive ? true : false,
        };

        // Handle image upload
        if (req.file) {
            newCategory.thumbnail = req.file.filename;
        }

        console.log('New category object:', newCategory);

        const createdCategory = new Category(newCategory);
        await createdCategory.save();

        console.log('Saved category:', createdCategory);

        req.flash('success_msg', `${name} Category is Added Successfully...`);
        return res.redirect('/admin/category');
    } catch (error) {
        console.error('Error adding category:', error);
        req.flash('error_msg', 'Error adding category: ' + error.message);
        res.redirect('/admin/category');
    }
};


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
        const { name, description, offer, isActive } = req.body;

        const editCategory = {
            name,
            description,
            categoryOffer: offer,
            isListed: isActive ? true : false,
        };

        // Handle image upload for edit
        if (req.file) {
            // Delete old image if exists
            const oldCategory = await Category.findById(id);
            if (oldCategory.thumbnail) {
                const oldImagePath = path.join(__dirname, '../uploads/categories', oldCategory.thumbnail);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            editCategory.thumbnail = req.file.filename;
        }

        await Category.updateOne({ _id: id }, { $set: editCategory });
        req.flash('success_msg', `${name} Category is Updated Successfully..`);
        return res.redirect('/admin/category');
    } catch (error) {
        console.log(error.message);
        req.flash('error_msg', 'Error updating category: ' + error.message);
        res.redirect('/admin/category');
    }
};





const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById(id);

        // Delete associated image if exists
        if (category.thumbnail) {
            const imagePath = path.join(__dirname, '../uploads/categories', category.thumbnail);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Category.deleteOne({ _id: id });
        req.flash('success_msg', `${category.name} Category is Deleted Successfully ... `);
        return res.redirect('/admin/category');
    } catch (error) {
        console.log(error.message);
        req.flash('error_msg', 'Error deleting category: ' + error.message);
        res.redirect('/admin/category');
    }
};


const viewCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await Category.findById({ _id: id });
        return res.render('admin/viewCategory', { category });
    } catch (error) {
        console.log(error.message)
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
    viewCategory,

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