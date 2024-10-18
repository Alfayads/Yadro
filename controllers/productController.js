const Product = require('../models/Product');
const Category = require('../models/Category');
const Users = require('../models/User');

const productDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById({ _id: id });
        const categories = await Category.find({});
        const category = await Category.findById({ _id: product.category })
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(4);

        if (!product) {
            req.flash('error_msg', 'Something went wrong!!');
            return res.redirect('/');
        }
        return res.render('user/single-product', { product, category, user, categories, relatedProducts });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getProductByCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.session.user_id;
        const categories = await Category.find({});
        const user = await Users.findById({ _id: userId });
        const category = await Category.findById({ _id: id });
        const products = await Product.find({ category: id })
        return res.render('user/productByCategory', { products, category, categories, user })
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getAllProducts = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});

        const { sort, search } = req.query;

        let query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        let sortOption = {};
        switch (sort) {
            case 'price_asc':
                sortOption = { salePrice: 1 };
                break;
            case 'price_desc':
                sortOption = { salePrice: -1 };
                break;
            case 'name_asc':
                sortOption = { name: 1 };
                break;
            case 'name_desc':
                sortOption = { name: -1 };
                break;
            case 'rating':
                sortOption = { averageRating: -1 };
                break;
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            default:
                sortOption = { popularity: -1 };
        }

        const products = await Product.find(query).sort(sortOption);

        return res.render('user/all-products', { products, user, categories, currentSort: sort, searchQuery: search });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


module.exports = {
    productDetails,
    getProductByCategory,
    getAllProducts
}