const razorpay = require('razorpay');

require('dotenv').config();

exports.createRazorpayInstance = () => {
    return new razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET
    })
}