const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deliveryAddress: {
        name: { type: String },
        streetAddress: { type: String },
        addressType: { type: String },
        city: { type: String },
        apartment: { type: String },
        landMark: { type: String },
        postalCode: { type: Number },
        phone: { type: String }
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
        enum: ['Credit Card', 'Debit Card', 'razorpay', 'cash'],
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['Ordered', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled', 'Return Requested', 'Return Approved', 'Return Rejected', 'Return Pending'
        ],
        default: 'Ordered'
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    couponApplied: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        default: null
    },
    offerApplied: {
        type: Number,
        default: 0
    },
    cancellationReason: {
        type: String,
        default: null
    },
    cancellationComment: {
        type: String,
        default: null
    },
    cancelDate: {
        type: String,
        default: null
    }
})

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;