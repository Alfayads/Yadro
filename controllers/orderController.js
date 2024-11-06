const Users = require('../models/User');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const mongoose = require('mongoose');
const Wallet = require('../models/wallet');
const Announcement = require('../models/announcement');
const ReturnOrder = require('../models/Return');
const { ObjectId } = require('mongoose').Types;


const getOrders = async (req, res, next) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const announcements = await Announcement.find({});
        const orders = await Order.find({ userId }).sort({ orderDate: -1 }).populate({
            path: 'items.productId',
            select: 'name images'
        }).populate({
            path: 'couponApplied',
            select: 'code'
        });
        return res.render('user/orders', {
            user,
            categories,
            orders,
            announcements
        })
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        next(error)
        return res.render('user/error', { error: errorMessage });
    }
}


const cancelOrder = async (req, res, next) => {
    try {
        const userId = req.session.user_id;
        const { reason, comments, cancelDate } = req.body;
        console.log(reason, comments);
        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        console.log("wallet Amount ======> ", (order.totalAmount - order.offerApplied))


        if (!order) {
            return res.status(404).json('Order not found');
        }
        if (order.orderStatus === 'Cancelled') {
            return res.status(400).json('Order is already cancelled');
        }

        const refundAmount = order.totalAmount - order.offerApplied;

        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.quantity += item.quantity;
                await product.save();
            } else {
                return res.status(404).json(`Product with ID ${item.productId} not found`);
            }
        }

        // Find or create the user's wallet
        let wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            // Create a new wallet with an initial balance equal to the refund amount
            wallet = new Wallet({
                userId,
                balance: refundAmount,
                transactions: [
                    {
                        type: 'Refund',
                        amount: refundAmount,
                        description: `Refund for order ${orderId}`,
                        date: new Date()
                    }
                ]
            });
            await wallet.save();
        } else {
            // Update the existing wallet by adding the refund amount
            wallet.balance += refundAmount;
            wallet.transactions.push({
                type: 'Refund',
                amount: refundAmount,
                description: `Refund for order ${orderId}`,
                date: new Date()
            });
            await wallet.save();
        }


        const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: 'Cancelled', cancellationReason: reason, cancelDate, cancellationComment: comments.length > 0 ? comments : null });

        console.log(updatedOrder)
        if (!updatedOrder) {
            return res.status(404).json('Order not found');
        }
        res.status(200).json('Order cancelled successfully');
    } catch (error) {
        console.error(error);
        next(error)
        res.status(500).send('Internal Server Error');
    }
}
const getOrderReturn = async (req, res, next) => {
    try {
        const userId = req.session.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not logged in' });
        }

        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const categories = await Category.find({});
        const id = req.params.id;
        const announcements = await Announcement.find({});
        const order = await Order.findById(id).populate({
            path: 'items.productId',
            select: 'name images'
        }).populate({
            path: 'couponApplied',
            select: 'code'
        });
        res.render('user/return', { order, user, categories, announcements });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
        next(error)
    }
};
const createReturn = async (req, res, next) => {
    try {
        const userId = req.session.user_id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not logged in' });
        }

        const { orderId } = req.params;
        const { reason, comments, selectedItems } = req.body;

        // Validate input
        if (!reason || !comments || !selectedItems?.length) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate order
        const order = await Order.findById(orderId);
        if (!order || order.userId.toString() !== userId) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or unauthorized'
            });
        }

        // Validate products exist
        const productIds = selectedItems.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        console.log('Products:', products, 'Product IDs:', productIds);

        // Uncomment this if you want to ensure all products exist
        // if (products.length !== productIds.length) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'One or more products not found'
        //     });
        // }

        // Create formatted items with validated products
        const formattedItems = selectedItems.map(item => ({
            productId: item.productId,
            quantity: parseInt(item.quantity, 10)
        }));

        // Create and save return request
        const returnRequest = new ReturnOrder({
            orderId,
            userId,
            items: formattedItems,
            reason,
            comments,
            returnStatus: 'Requested'
        });

        await returnRequest.save();

        await Order.findByIdAndUpdate(orderId, { orderStatus: 'Return Requested' });


        // Return success with populated data
        const populatedReturn = await ReturnOrder.findById(returnRequest._id)
            .populate('items.productId', 'name salePrice')
            .lean();

        console.log('Populated Return ==> ', populatedReturn);
        return res.status(200).json({
            success: true,
            message: 'Return request submitted successfully',
            data: populatedReturn
        });

    } catch (error) {
        console.error('Error creating return request:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while processing return request',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
        next(error)
    }
};





module.exports = {
    getOrders,
    cancelOrder,
    getOrderReturn,
    createReturn,
}