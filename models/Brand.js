const mongoose = require('mongoose');

const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String
    },
    description: {
        type: String,
    },
    website: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
}, { timestamps: true })


const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
