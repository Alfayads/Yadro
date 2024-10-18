const Users = require('../models/User');
const Category = require('../models/Category');
const Wishlist = require('../models/Wishlist');
const mongoose = require('mongoose')
const Product = require('../models/Product')


const getWishList = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const wishlist = await Wishlist.findOne({ userId }).populate('products');

        const wishlistProducts = wishlist ? wishlist.products : [];

        if (wishlist && wishlist.products.length > 0) {

            const productIds = wishlist.products.map(item => item.productId);
            const products = await Product.find({ _id: { $in: productIds } });


            res.render('user/wishlist', { wishlistProducts: products, user, categories });
        } else {
            res.render('user/wishlist', { wishlistProducts: [], user, categories });
        }
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getWishlistCount = async (req, res) => {
    try {
        const userId = req.session.user_id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const wishlist = await Wishlist.findOne({ userId });
        const wishlistCount = wishlist ? wishlist.products.length : 0;

        return res.status(200).json({ success: true, wishlistCount });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Error fetching wishlist count' });
    }
};

const addWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log(productId);
        const userId = req.session.user_id;
        const productObjectId = new mongoose.Types.ObjectId(productId);

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({
                userId,
                products: [{ productId: productObjectId }],
            });
        } else {
            const isProductInWishlist = wishlist.products.some(
                (item) => item.productId.equals(productObjectId)
            );

            if (!isProductInWishlist) {
                wishlist.products.push({ productId: productObjectId });
            }
        }

        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist successfully.",
        });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.status(500).json({ success: false, error: errorMessage });
    }
};



const removeWishlist = async (req, res) => {
    try {

        console.log('Received DELETE request to remove from wishlist:', {
            body: req.body,
            userId: req.session.user_id,
            url: req.url,
            method: req.method
        });
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required.",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Product ID format.",
            });
        }

        const userId = req.session.user_id;
        const productObjectId = new mongoose.Types.ObjectId(productId);

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found.",
            });
        }
        const productIndex = wishlist.products.findIndex(
            (item) => item.productId.equals(productObjectId)
        );

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist.",
            });
        }

        wishlist.products.splice(productIndex, 1);
        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully.",
        });
    } catch (error) {
        console.error("Error removing product from wishlist:", error.message);
        return res.status(500).json({
            success: false,
            message: "An error occurred. Please try again later.",
        });
    }
};

module.exports = {
    addWishlist,
    getWishList,
    getWishlistCount,
    removeWishlist
}