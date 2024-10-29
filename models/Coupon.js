const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    offerType: {
        type: String,
        enum: ['percentage', 'flat'],
        required: true
    },
    offerValue: {
        type: Number,
        required: true
    },
    minimumPrice: {
        type: Number,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
        required: true
    },
    expiredOn: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usagePerUserLimit: {
        type: Number,
        default: 1
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    couponUsed: {
        type: Number,
        default: 0
    }
});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;
