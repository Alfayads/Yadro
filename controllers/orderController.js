const Users = require('../models/User');
const Category = require('../models/Category');
const Order = require('../models/Order');

const getOrders = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }).populate({
            path: 'items.productId',
            select: 'name'
        });;
        return res.render('user/orders', {
            user,
            categories,
            orders
        })
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus: 'Cancelled' }, { new: true });
        if (!updatedOrder) {
            return res.status(404).send('Order not found');
        }
        res.status(200).send('Order cancelled successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    getOrders,
    cancelOrder
}