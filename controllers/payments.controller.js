const { createRazorpayInstance } = require("../config/razorpay.config");
const crypto = require('crypto');
require('dotenv').config();
const razorpayInstance = createRazorpayInstance()

exports.createOrder = async (req, res) => {
    const { amount, orderData } = req.body;

    console.log('AAAAAAAMOUNT ==> ', amount)
    console.log("^^^^^^^^^^^^^^^^^", orderData)
    const options = {
        amount: amount * 100,
        currency: 'INR',
        receipt: `order_rcptid_${Math.floor(Math.random() * 1000000)}`,
    };

    console.log('===========> options', options)

    try {
        const order = await razorpayInstance.orders.create(options);
        console.log('ooooooooooooooooooorder', order)
        return res.status(200).json({
            success: true,
            orderData: orderData, // Return the created order ID
            order: order // Optionally return the full order data
        });
    } catch (error) {
        console.error('Error in createOrder:', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong..',
        });
    }
};
// exports.verifyPayment = async (req, res) => {
//     const { order_id, payment_id, signature } = req.body;

//     const KEY_SECRET = process.env.KEY_SECRET; // Ensure this is correct

//     // Create a HMAC using the key secret
//     const hmac = crypto.createHmac('sha256', KEY_SECRET);
//     hmac.update(`${order_id}|${payment_id}`); // Use template literals to format correctly

//     // Generate the signature
//     const generatedSignature = hmac.digest('hex');

//     // Debugging
//     console.log('Generated Signature:', generatedSignature);
//     console.log('Received Signature:', signature);

//     // Verify the signature
//     if (generatedSignature === signature) {
//         console.log('payment verified')
//         return res.status(200).json({
//             success: true,
//             message: 'Payment Verified'
//         });
//     } else {
//         return res.status(400).json({
//             success: false,
//             message: 'Payment Not Verified',
//             generatedSignature,
//             signature
//         });
//     }
// };