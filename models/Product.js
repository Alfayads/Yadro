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
    },
    salesCount: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    featuredStart: { type: Date },
    featuredEnd: { type: Date }

}, { timestamps: true });


productSchema.statics.findBestSelling = function (limit = 10) {
    return this.find()
        .sort({ salesCount: -1 })
        .limit(limit);
};

productSchema.statics.findFeatured = function () {
    const now = new Date();
    return this.find({
        isFeatured: true,
        featuredStart: { $lte: now },
        featuredEnd: { $gte: now }
    });
};

productSchema.statics.findNewProducts = function (days = 30, limit = 10) {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return this.find({
        createdAt: { $gte: dateThreshold }
    })
        .sort({ createdAt: -1 })
        .limit(limit);
};


const product = mongoose.model('Product', productSchema);
module.exports = product;