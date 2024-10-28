const Coupon = require('../models/Coupon');
const Users = require('../models/User');
const Cart = require('../models/Cart')

const applyCoupon = async (req, res) => {
    try {
        const { couponCode } = req.body;
        const userId = req.session.user_id;
        console.log('Received request body: =====================>', req.body);

        console.log(`Received coupon code: ${couponCode}`);

        // Fetch the user's cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        const coupon = await Coupon.findOne({ code: couponCode, isActive: true });


        const user = await Users.findById(userId);

        if (user.couponUsed && user.couponUsed.includes(coupon._id)) {
            return res.status(400).json({ message: 'You have already used this coupon' });
        }



        // Calculate the cart total
        let cartTotal = 0;
        cart.items.forEach(item => {
            cartTotal += item.totalPrice;
        });

        console.log("Total Cart Value ==> ", cartTotal)

        // Find coupon by code
        console.log('Coupon found: ', coupon); // Log the result

        // Validate coupon
        if (!coupon) {
            return res.status(400).json({ message: 'Invalid or expired coupon code' });
        }

        const currentDate = new Date();
        if (currentDate > coupon.expiredOn) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        // Ensure cart total meets the minimum price requirement
        if (cartTotal < coupon.minimumPrice) {
            return res.status(400).json({ message: `Minimum purchase amount of $${coupon.minimumPrice} is required` });
        }

        // Calculate discount based on the offerType
        let discount = 0;
        if (coupon.offerType === 'percentage') {
            discount = (coupon.offerValue / 100) * cartTotal;
        } else if (coupon.offerType === 'flat') {
            discount = coupon.offerValue;
        }

        const discountedTotal = Math.max(cartTotal - discount, 0); // Ensure total is not negative

        // Respond with the discount and new total
        return res.status(200).json({
            message: 'Coupon applied successfully',
            discount,
            discountedTotal
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    applyCoupon
}