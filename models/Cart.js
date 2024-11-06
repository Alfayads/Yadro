const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "Placed"
        }
    }],
    shippingCharge: {
        type: Number,
        default: 0
    }
});

// Pre-save hook to calculate the shipping charge
cartSchema.pre('save', function (next) {
    // Calculate the total price of items
    const totalCartPrice = this.items.reduce((acc, item) => acc + item.totalPrice, 0);

    // Set the shipping charge based on the total price
    this.shippingCharge = totalCartPrice >= 5000 ? 0 : 400;

    next();
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
