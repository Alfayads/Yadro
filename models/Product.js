const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    regularPrice: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        required: false
    },
    images: [{ type: String }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    productOffer: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: true
    },
    color: {
        type: String,
        required: true
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["Available", "Out Of Stock", "Discontinued"],
        required: true,
        default: "Available"
    }

}, { timestamps: true });

const product = mongoose.model('Product', productSchema);
module.exports = product;