const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const mongoose = require('mongoose')

const Users = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const Brand = require('../models/Brand');
const Order = require('../models/Order');
const exp = require('constants');

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
    const Emailregex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    try {

        const { email, password } = req.body;

        if (!Emailregex.test(email)) {
            req.flash('error_msg', 'Enter Valid Email Address !!');
            return res.redirect('/admin/login');
        }

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
        }).populate('category', 'name').limit(limit).skip((page - 1) * limit).exec();

        const categories = await Category.find({});

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
            categories
        });
    } catch (error) {
        console.log(error.message)
    }
}

// Add product page

const getAddProduct = async (req, res) => {
    try {
        const oldValue = req.session.oldValue || {};
        const categories = await Category.find({});
        req.session.oldValue = null;
        return res.render('admin/add-product', { categories, oldValue });
    } catch (error) {
        console.log(error.message);
    }
}



const addProduct = async (req, res) => {
    try {
        const { name, description, brand, price, category, quantity, color, discount } = req.body;

        if (!name || !description || !brand || !color || !category || !quantity || !discount || !price) {
            const oldValue = { name, description, brand, color, category, quantity, discount, price };
            req.session.oldValue = oldValue;
            req.flash('error_msg', 'Please provide all fields');
            return res.redirect('/admin/add-product');
        }

        if (price < 100) {
            const oldValue = { name, description, brand, color, category, quantity, discount, price };
            req.session.oldValue = oldValue;
            req.flash('error_msg', 'Price must be greater than 100');
            return res.redirect('/admin/add-product');
        }

        if (quantity <= 0) {
            const oldValue = { name, description, brand, color, category, quantity, discount, price };
            req.session.oldValue = oldValue;
            req.flash('error_msg', 'quantity must be greater than 1');
            return res.redirect('/admin/add-product');
        }

        if (discount > 90) {
            const oldValue = { name, description, brand, color, category, quantity, discount, price };
            req.session.oldValue = oldValue;
            req.flash('error_msg', 'Discount must be less than 90%');
            return res.redirect('/admin/add-product');
        }

        let findProduct = await Product.findOne({ name });
        if (findProduct) {
            const oldValue = { name, description, brand, color, category, quantity, discount, price };
            req.session.oldValue = oldValue;
            req.flash('error_msg', 'Product Already Exists');
            return res.redirect('/admin/add-product');
        }

        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            const oldValue = { name, description, brand, color, category, quantity, discount, price };
            req.session.oldValue = oldValue;
            req.flash('error_msg', 'Invalid category');
            return res.redirect('/admin/add-product');
        }

        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            console.log("add products", req.files);
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
        const {
            name,
            description,
            stock: quantity,
            price,
            color,
            brand,
            discount,
            category,
            existingImages,
            removedImages
        } = req.body;

        console.log("Files:", req.files);

        const parsedQuantity = parseInt(quantity);

        // Validation checks
        if (price < 100) {
            req.flash('error_msg', 'Price must be at least 100');
            return res.redirect(`/admin/product`);
        }

        if (parsedQuantity <= 0) {
            req.flash('error_msg', 'Quantity must be greater than 1');
            return res.redirect(`/admin/product`);
        }

        if (discount > 90) {
            req.flash('error_msg', 'Discount must be less than 90');
            return res.redirect(`/admin/product`);
        }

        if (isNaN(parsedQuantity)) {
            req.flash('error_msg', 'Quantity must be a valid number');
            return res.redirect(`/admin/product`);
        }

        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice)) {
            req.flash('error_msg', 'Price must be a valid number');
            return res.redirect(`/admin/edit-product/${id}`);
        }

        // Category validation
        const categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            req.flash('error_msg', 'Invalid category');
            return res.redirect('/admin/add-product');
        }

        // Find existing product
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            req.flash('error_msg', 'Product not found');
            return res.redirect('/admin/product');
        }

        // Handle image management
        let finalImagePaths = [];

        // Handle removed images
        const removedImagesArray = Array.isArray(removedImages) ? removedImages :
            removedImages ? [removedImages] : [];

        if (removedImagesArray.length > 0) {
            // Remove files from storage
            removedImagesArray.forEach(imagePath => {
                // Extract filename from path
                const filename = imagePath.split('/').pop();
                const fullPath = path.join(__dirname, '../public/products', filename);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
        }

        // Keep existing images that weren't removed
        const existingImagesArray = Array.isArray(existingImages) ? existingImages :
            existingImages ? [existingImages] : [];

        finalImagePaths = existingImagesArray.filter(img =>
            !removedImagesArray.includes(img)
        );

        // Add new images
        if (req.files && req.files.length > 0) {
            const newImagePaths = req.files.map(file => `/products/${file.filename}`);
            finalImagePaths = [...finalImagePaths, ...newImagePaths];
        }

        // Validate final image count
        if (finalImagePaths.length === 0) {
            req.flash('error_msg', 'Product must have at least one image');
            return res.redirect(`/admin/edit-product/${id}`);
        }

        if (finalImagePaths.length > 4) {
            // Remove excess files if they were somehow uploaded
            const excessImages = finalImagePaths.slice(4);
            excessImages.forEach(imagePath => {
                const filename = imagePath.split('/').pop();
                const fullPath = path.join(__dirname, '../public/products', filename);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            });
            finalImagePaths = finalImagePaths.slice(0, 4);
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
            images: finalImagePaths
        };

        await Product.updateOne({ _id: id }, { $set: updatedProduct });
        req.flash('success_msg', `${name} Edited Successfully...`);
        return res.redirect('/admin/product');

    } catch (error) {
        console.error('Error in edittedProduct:', error);
        req.flash('error_msg', 'An error occurred while updating the product');
        return res.redirect('/admin/product');
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

const blockProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const findProduct = await Product.findById({ _id: id });
        await Product.updateOne({ _id: id }, { $set: { isBlocked: true } });
        req.flash('success_msg', `${findProduct.name} Product Blocked Successfully...`);
        return res.redirect('/admin/product')
    } catch (error) {
        console.log(error.message);
    }
}

const unblockProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const findProduct = await Product.findById({ _id: id });
        await Product.updateOne({ _id: id }, { $set: { isBlocked: false } });
        req.flash('success_msg', `${findProduct.name} Product UnBlocked Successfully...`);
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
        console.log(req.body)
        const { CategoryName, CatogoryDescription, offer, isActive } = req.body;

        if (!CategoryName && !CatogoryDescription) {
            req.flash('error_msg', 'All Fieds are Required !! Check again');
            return res.redirect('/admin/add-category');
        }

        if (offer > 90) {
            req.flash('error_msg', 'Offer Must be less than 90%');
            return res.redirect('/admin/add-category');
        }

        let existingCategory = await Category.findOne({ name: CategoryName });
        if (existingCategory) {
            req.flash('error_msg', 'This category already exists. Try a different Category.');
            return res.redirect('/admin/add-category');
        }

        const createdCategory = new Category({
            name: CategoryName,
            description: CatogoryDescription,
            categoryOffer: offer ? offer : 0,
            isListed: isActive ? true : false,
        });
        await createdCategory.save();

        console.log('Saved category:', createdCategory);

        req.flash('success_msg', `${CategoryName} Category is Added Successfully...`);
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
            categoryOffer: offer ? offer : 0,
            isListed: isActive ? true : false,
        };

        // // Handle image upload for edit
        // if (req.file) {
        //     // Delete old image if exists
        //     const oldCategory = await Category.findById(id);
        //     if (oldCategory.thumbnail) {
        //         const oldImagePath = path.join(__dirname, '../uploads/categories', oldCategory.thumbnail);
        //         if (fs.existsSync(oldImagePath)) {
        //             fs.unlinkSync(oldImagePath);
        //         }
        //     }
        //     editCategory.thumbnail = req.file.filename;
        // }

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
        console.error('Error blocking customer:', error);
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
        console.error('Error blocking customer:', error);
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


const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        return res.render('admin/coupons', { coupons });
    } catch (error) {
        console.log(error.message);
    }
}

const getAddCoupon = (req, res) => {
    try {
        const oldValue = req.session.adminOldValue || {};
        req.session.adminOldValue = null;
        const date = new Date();
        console.log(date.toISOString().split('T')[0])
        return res.render('admin/add-coupon', { oldValue });
    } catch (error) {
        console.log(error.message);
    }
}

const addCoupon = async (req, res) => {
    try {
        const {
            name,
            code,
            offerType,
            offerValue,
            minimumPrice,
            expiredOn,
            isActive,
            usageLimit,
            usagePerUserLimit,
        } = req.body;

        if (!name || !code || !offerType || !minimumPrice || !expiredOn || !usageLimit) {
            const oldValue = { name, code, offerType, offerValue, minimumPrice, expiredOn, usageLimit, usagePerUserLimit };
            req.session.adminOldValue = oldValue;
            req.flash('error_msg', 'All Fields are required Check Again !! ');
            return res.redirect('/admin/add-coupon')
        }

        const existingCoupon = await Coupon.findOne({ $or: [{ name }, { code }] });
        if (existingCoupon) {
            req.flash('error_msg', 'Coupon with the same name or code already exists.');
            return res.redirect('/admin/add-coupon');
        }

        const newCoupon = new Coupon({
            name,
            code,
            offerType,
            offerValue,
            minimumPrice,
            expiredOn,
            isActive: isActive ? true : false,
            usageLimit,
            usagePerUserLimit,
        });

        await newCoupon.save();
        req.flash('success_msg', `Coupon ${name} has been added successfully.`);
        res.redirect('/admin/coupons');
    } catch (error) {
        console.log(error.message);
        req.flash('error_msg', 'An error occurred while adding the coupon.');
        res.redirect('/admin/coupons');
    }
};

const getEditCoupon = async (req, res) => {
    try {
        const id = req.params.id;
        const oldValue = req.session.oldValue || {};
        req.session.oldValue = {};
        const coupon = await Coupon.findById(id);
        res.render('admin/edit-coupon', { coupon, oldValue, Id: coupon._id })
    } catch (error) {
        console.log(error.message);
        req.flash('error_msg', 'An error occurred while editing the coupon.');
        res.redirect('/admin/coupons');
    }
}


const editCoupon = async (req, res) => {
    try {
        const userId = req.params.id; // Coupon ID passed as a route parameter
        const {
            name,
            code,
            offerType,
            offerValue,
            minimumPrice,
            expiredOn,
            isActive,
            usageLimit,
            usagePerUserLimit,
        } = req.body;

        const updatedData = {
            name: name,
            code: code,
            offerType: offerType,
            offerValue: offerValue,
            minimumPrice: minimumPrice,
            expiredOn: new Date(req.body.expiredOn),
            usageLimit: usageLimit,
            usagePerUserLimit: usagePerUserLimit,
            isActive: isActive ? true : false // Check if the toggle is on
        };


        await Coupon.findByIdAndUpdate(userId, updatedData);
        req.flash('success_msg', `Coupon ${name} has been updated successfully.`);
        res.redirect('/admin/coupons');
    } catch (error) {
        console.log(error.message);
        req.flash('error_msg', 'An error occurred while editing the coupon.');
        res.redirect('/admin/coupons');
    }
};

const viewCoupon = async (req, res) => {
    try {
        const id = req.params.id;
        const coupon = await Coupon.findById(id);
        res.render('admin/viewCoupon', { coupon })
    } catch (error) {
        console.log(error.message);
        req.flash('error_msg', 'An error occurred while editing the coupon.');
        res.redirect('/admin/coupons');
    }
}



const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCoupon = await Coupon.findByIdAndDelete(id);
        if (!deletedCoupon) {
            req.flash('error_msg', 'Coupon not found.');
            return res.redirect('/admin/coupons');
        }

        req.flash('success_msg', `Coupon ${deletedCoupon.name} has been deleted successfully.`);
        res.redirect('/admin/coupons');
    } catch (error) {
        console.log(error.message);
        req.flash('error_msg', 'An error occurred while deleting the coupon.');
        res.redirect('/admin/coupons');
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: 'userId',
                select: 'fname lname',
            })
            .populate({
                path: 'deliveryAddress',
                model: 'Address'
            })
            .populate({
                path: 'items.productId',
                select: 'name'
            });

        console.log(orders)
        res.render('admin/orders', { orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error. Could not fetch orders.' });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // Validate inputs
        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: 'Order ID and status are required'
            });
        }

        // Update the order
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: status },
            { new: true } // Returns the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};


const viewOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // Fetch order with populated references
        const order = await Order.findById(orderId)
            .populate('userId', 'fname lname email phone') // Populate user details
            .populate({
                path: 'items.productId',
                select: 'name price images' // Select the fields you want from product
            });

        if (!order) {
            return res.status(404).render('error', {
                message: 'Order not found',
                error: { status: 404 }
            });
        }

        // Add timeline data if not exists
        if (!order.timeline || order.timeline.length === 0) {
            order.timeline = [{
                status: order.orderStatus,
                timestamp: order.orderDate,
                comment: 'Order placed successfully'
            }];
        }

        // Calculate order summary
        const orderSummary = {
            subtotal: order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shippingCost: order.shippingCost || 0,
            discount: order.discount || 0,
            totalAmount: order.totalAmount
        };

        // Merge orderSummary with order object
        const enrichedOrder = {
            ...order.toObject(),
            ...orderSummary
        };

        // Render the order details page
        res.render('admin/viewOrder', {
            order: enrichedOrder,
            title: `Order Details - #${order._id}`
        });

    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({
            message: 'Error fetching order details',
            error: { status: 500 }
        });
    }
};






// const viewOrderDetail = async (req, res) => {
//     try {
//         console.log("Request Params: ", req.params); // Log all request params

//         const orderId = req.params.id;

//         // Check if orderId is valid
//         if (!mongoose.Types.ObjectId.isValid(orderId)) {
//             return res.status(400).send('Invalid Order ID');
//         }

//         const order = await Order.findById(orderId)
//             .populate('userId', 'fname lname email') // Adjust for 'fname' and 'lname'
//             .populate({
//                 path: 'deliveryAddress',  // Populate deliveryAddress
//                 populate: { path: 'address' }  // Ensure we populate the embedded 'address' array
//             }) // Ensure this path is correct in your schema
//             .populate('items.productId', 'name image') // Fetch necessary product details
//             .exec();

//         if (!order) {
//             return res.status(404).send('Order not found');
//         }

//         res.render('admin/order-detail', { order });
//     } catch (error) {
//         console.log(error.message)
//     }
// }

const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find({});
        return res.render('admin/brand', { brands });
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

const addBrand = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        console.log(name, description, status);


        if (!name || !description) {
            req.flash('error_msg', 'Name or Description is Not Added Check Again !!');
            return res.redirect('/admin/add-brand');
        }

        const newBrand = new Brand({
            name,
            description,
            isActive: status === 'active' ? true : false
        })

        await newBrand.save();
        req.flash('success_msg', `${name} Brand is Addedd Successfully..`);
        return res.redirect('/admin/brands')

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


const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, timeFrame = 'daily' } = req.query;

        // Base match condition
        let matchCondition = {
            orderStatus: { $ne: 'Cancelled' }
        };


        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (!isNaN(start) && !isNaN(end)) {
                matchCondition.orderDate = { $gte: start, $lte: end };
            } else {
                return res.status(400).json({ success: false, message: "Invalid date format" });
            }
        }

        let dateFormat;
        switch (timeFrame) {
            case 'weekly':
                dateFormat = { $dateToString: { format: "%Y-W%V", date: "$orderDate" } };
                break;
            case 'monthly':
                dateFormat = { $dateToString: { format: "%Y-%m", date: "$orderDate" } };
                break;
            case 'yearly':
                dateFormat = { $dateToString: { format: "%Y", date: "$orderDate" } };
                break;
            default:
                dateFormat = { $dateToString: { format: "%Y-%m-%d", date: "$orderDate" } };
        }

        const salesData = await Order.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: dateFormat,
                    sales: { $sum: { $subtract: ["$totalAmount", "$offerApplied"] } },
                    orders: { $sum: 1 },
                    avgOrderValue: { $avg: { $subtract: ["$totalAmount", "$offerApplied"] } },
                    totalItems: {
                        $sum: {
                            $reduce: {
                                input: "$items",
                                initialValue: 0,
                                in: { $add: ["$$value", "$$this.quantity"] }
                            }
                        }
                    }
                }
            },
            { $sort: { "_id": 1 } },
            {
                $project: {
                    date: "$_id",
                    sales: 1,
                    orders: 1,
                    avgOrderValue: { $round: ["$avgOrderValue", 2] },
                    totalItems: 1,
                    _id: 0
                }
            }
        ]);

        const summary = salesData.length ? {
            totalSales: salesData.reduce((sum, item) => sum + item.sales, 0),
            totalOrders: salesData.reduce((sum, item) => sum + item.orders, 0),
            avgOrderValue: (salesData.reduce((sum, item) => sum + item.avgOrderValue, 0) / salesData.length).toFixed(2),
            totalItems: salesData.reduce((sum, item) => sum + item.totalItems, 0)
        } : { totalSales: 0, totalOrders: 0, avgOrderValue: 0, totalItems: 0 };

        // Get payment method distribution
        const paymentMethodStats = await Order.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: "$paymentMethod",
                    count: { $sum: 1 },
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);

        res.json({
            success: true,
            data: { salesData, summary, paymentMethodStats }
        });

    } catch (error) {
        console.error('Sales Report Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating sales report',
            error: error.message
        });
    }
};




module.exports = {

    getSalesReport,




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
    blockProduct,
    unblockProduct,

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
    addCoupon,
    getEditCoupon,
    editCoupon,
    deleteCoupon,
    viewCoupon,

    getOrders,
    updateOrderStatus,
    viewOrderDetails,

    getBrands,
    getAddBrand,
    addBrand,

    getBanners,
    getAddBanner
}




