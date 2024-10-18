const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
        sparse: true,
        default: null
    },
    googleId: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: false
    },
    verify: {
        type: Boolean,
        required: true,
        default: false
    },
    gender: {
        type: String,
        required: false
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }],
    wallet: {
        type: Number,
        default: 0
    },
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist"
    }],
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    createdOn: {
        type: Date,
        default: Date.now,
    },
    referalCode: {
        type: String,
    },
    redeemed: {
        type: Boolean
    },
    redeemedUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],


}, { timestamps: true })

const User = mongoose.model('User', userSchema);
module.exports = User;