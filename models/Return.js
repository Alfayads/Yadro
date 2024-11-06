// models/ReturnOrder.js
const mongoose = require('mongoose');

// models/ReturnOrder.js
const returnOrderSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    comments: { type: String },
    requestDate: { type: Date, default: Date.now },
    returnStatus: { type: String, enum: ['Requested', 'Approved', 'Rejected', 'Completed'], default: 'Requested' },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }]
});


returnOrderSchema.pre('find', function (next) {
    this.populate({
        path: 'items.productId',
        select: 'name salePrice images',
        // Handle case where product doesn't exist
        match: { deletedAt: { $exists: false } }
    });
    next();
});


// Add a method to validate product existence
returnOrderSchema.methods.validateProducts = async function () {
    const Product = mongoose.model('Product');
    const productIds = this.items.map(item => item.productId);
    const existingProducts = await Product.find({ '_id': { $in: productIds } });
    return existingProducts.length === productIds.length;
};

module.exports = mongoose.model('ReturnOrder', returnOrderSchema);