const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deliveryAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'],
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Ordered', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled'],
        default: 'Ordered'
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
})

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;