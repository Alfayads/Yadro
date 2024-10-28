const Users = require('../models/User');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const mongoose = require('mongoose');
const Wallet = require('../models/wallet');

const getOrders = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).populate({
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
        })
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const cancelOrder = async (req, res) => {
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
        res.status(500).send('Internal Server Error');
    }
}


const getOrderReturn = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const id = req.params.id;
        const order = await Order.findById(id).populate({
            path: 'items.productId',
            select: 'name images'
        }).populate({
            path: 'couponApplied',
            select: 'code'
        });
        res.render('user/return', { order, user, categories })
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


const createReturn = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const orderId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ success: false, message: 'Invalid Order ID format' });
        }

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check if the order is eligible for return
        if (order.orderStatus === 'Returned' || order.orderStatus === 'Cancelled') {
            return res.status(400).json({ success: false, message: 'Order is not eligible for return' });
        }

        // Render return request page
        return res.render('user/return-request', {
            order,
            title: `Return Request - Order #${orderId}`,
            user: await Users.findById(userId),
            categories: await Category.find({})
        });

    } catch (error) {
        console.error('Error in createReturn:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


module.exports = {
    getOrders,
    cancelOrder,
    getOrderReturn,
    createReturn,
}