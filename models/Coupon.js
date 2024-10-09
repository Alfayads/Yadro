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
    createdOn: {
        type: Date,
        required: true,
        default: Date.now,
    },
    expiredOn: {
        type: Date,
        required: true
    },
    offer: {
        type: Number,
        required: true
    },
    minimumPrice: {
        type: Number,
        required: true
    },
    isList: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;