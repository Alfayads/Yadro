const Coupon = require('../models/Coupon');
const Users = require('../models/User');
const Cart = require('../models/Cart');
const Announcement = require('../models/announcement')

const applyCoupon = async (req, res, next) => {
    try {
        const { couponCode } = req.body;
        const userId = req.session.user_id;

        // Fetch the user's cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // Find the coupon
        const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
        if (!coupon) {
            return res.status(400).json({ message: 'Invalid or expired coupon code' });
        }

        // Check if coupon has reached the usage limit
        if (coupon.usageLimit && coupon.couponUsed >= coupon.usageLimit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        // Check if user has reached their usage limit for this coupon
        const user = await Users.findById(userId);
        if (user.couponUsed && user.couponUsed.includes(coupon._id)) {
            return res.status(400).json({ message: 'You have already used this coupon' });
        }

        // Calculate the cart total
        let cartTotal = 0;
        cart.items.forEach(item => {
            cartTotal += item.totalPrice;
        });

        // Ensure cart total meets the minimum price requirement
        if (cartTotal < coupon.minimumPrice) {
            return res.status(400).json({ message: `Minimum purchase amount of $${coupon.minimumPrice} is required` });
        }

        // Calculate discount based on offerType
        let discount = 0;
        if (coupon.offerType === 'percentage') {
            discount = (coupon.offerValue / 100) * cartTotal;
        } else if (coupon.offerType === 'flat') {
            discount = coupon.offerValue;
        }

        const discountedTotal = Math.max(cartTotal - discount, 0); // Ensure total is not negative

        // Increment coupon usage count
        coupon.couponUsed += 1;
        await coupon.save();

        // Add coupon ID to user's used coupons list
        user.couponUsed = user.couponUsed || [];
        user.couponUsed.push(coupon._id);
        await user.save();

        // Respond with the discount and new total
        return res.status(200).json({
            message: 'Coupon applied successfully',
            discount,
            discountedTotal
        });

    } catch (error) {
        console.log(error.message);
        next(error)
        return res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = {
    applyCoupon
}