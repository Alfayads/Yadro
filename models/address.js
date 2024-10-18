const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address: [{
        name: {
            type: String,
            required: true
        },
        streetAddress: {
            type: String,
            required: true,
            trim: true
        },
        addressType: {
            type: String, required: true,
            enum: ["Home", "Office"],
            default: "Home"
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        apartment: {
            type: String,
            required: true,
            trim: true
        },
        country: {
            type: String,
            required: true,
            trim: true
        },
        landMark: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            required: true,
            trim: true
        },
        postalCode: {
            type: Number,
            required: true,
            trim: true
        },
        phone: {
            type: String,
            required: true
        }
    }]
}, { timestamps: true })


const Address = mongoose.model('Address', addressSchema);
module.exports = Address;