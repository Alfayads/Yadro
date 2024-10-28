const Users = require('../models/User');
const Category = require('../models/Category');
const Cart = require('../models/Cart');
const Address = require('../models/address')
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { default: mongoose, Types } = require('mongoose');

const getCart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (!cart) {
            return res.render('user/cart', { user, cartItems: [], totalPrice: 0 });
        }

        const cartItems = cart.items.map(item => {
            return {
                productId: item.productId._id,
                name: item.productId.name,
                description: item.productId.description,
                images: item.productId.images,
                price: item.price,
                quantity: item.quantity,
                totalPrice: item.totalPrice
            }
        })

        const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

        return res.render('user/cart', { user, cartItems, categories, totalPrice });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.session.user_id;
    try {
        console.log('Product Id => ' + productId + " quantity => " + quantity);

        const product = await Product.findById({ _id: productId });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product Not Found" })
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingProduct = cart.items.findIndex(item => item.productId.equals(productId));

        if (existingProduct > -1) {
            cart.items[existingProduct].quantity += quantity;
            cart.items[existingProduct].totalPrice = cart.items[existingProduct].quantity * product.salePrice
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                quantity,
                totalPrice: product.salePrice * quantity,
                price: product.salePrice
            })
        }

        await cart.save();
        req.session.cart = cart;
        res.json({ success: true, message: 'Product added to cart' });
    } catch (error) {
        console.log(error.message)
    }
}

const deleteCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.user_id;

        try {
            let cart = await Cart.findOne({ userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: "Cart not found" });
            }
            const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

            if (itemIndex > -1) {
                cart.items.splice(itemIndex, 1);
                await cart.save();
                req.session.cart = cart;
                res.json({ success: true, message: "Item removed from cart", cart });
            } else {
                res.status(404).json({ success: false, message: "Item not found in cart" });
            }
        } catch (error) {
            console.log(error.message)
        }
    } catch (error) {
        console.log(error.message)
    }
}

const getCartCount = async (req, res) => {
    try {
        const userId = req.session.user_id;
        if (!userId) {
            return res.json({ success: true, cartCount: 0 });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart || !cart.items.length) {
            return res.json({
                success: true,
                cartCount: 0
            })
        }

        const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

        return res.json({
            success: true,
            cartCount
        })
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: 'Failed to fetch cart count' });
    }
}


const getCheckOut = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const oldValue = req.session.oldValue || {};
        req.session.oldValue = null;

        const userAddresses = await Address.findOne({ userId: userId });
        const addresses = userAddresses ? userAddresses.address : [];


        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if (cart.items.length < 1) {
            return res.render('user/cart', { user, cartItems: [], totalPrice: 0 });
        }

        const cartItems = cart.items.map(item => {
            return {
                productId: item.productId._id,
                name: item.productId.name,
                description: item.productId.description,
                images: item.productId.images,
                price: item.price,
                quantity: item.quantity,
                totalPrice: item.totalPrice
            }
        })

        const totalPrice = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);


        return res.render('user/checkout', {
            user,
            categories,
            addresses,
            cartItems,
            oldValue,
            totalPrice
        });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const updateQuantity = async (req, res) => {
    console.log('update quantity')
    try {
        const { productId, quantity, shippingCharge } = req.body;  // Add shippingCharge to destructuring
        const userId = req.session.user_id;

        // Constants for shipping calculations
        const FREE_SHIPPING_THRESHOLD = 50000; // ₹50,000
        const BASE_SHIPPING_CHARGE = 400; // ₹400

        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        let cart = await Cart.findOne({ userId });
        console.log(cart)

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const cartItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (cartItemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart' });
        }

        // Ensure quantity is a positive integer
        const newQuantity = Math.max(1, Math.floor(Number(quantity)));

        // Update the item in the cart
        cart.items[cartItemIndex].quantity = newQuantity;
        cart.items[cartItemIndex].totalPrice = Number((cart.items[cartItemIndex].price * newQuantity).toFixed(2));

        // Recalculate subtotal (before shipping)
        const subtotal = Number(cart.items.reduce((total, item) => total + item.totalPrice, 0).toFixed(2));

        // Calculate shipping charge
        let finalShippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_CHARGE;

        // Calculate final total with shipping
        cart.total = Number((subtotal + finalShippingCharge).toFixed(2));

        // Store shipping information in cart (optional, if you want to persist it)
        cart.shippingCharge = finalShippingCharge;
        cart.subtotal = subtotal;

        // Use mongoose's markModified to ensure the changes are saved
        cart.markModified('items');
        cart.markModified('shippingCharge');
        cart.markModified('subtotal');

        await cart.save();

        res.json({
            success: true,
            newQuantity: cart.items[cartItemIndex].quantity,
            newTotalPrice: cart.items[cartItemIndex].totalPrice,
            subtotal: cart.subtotal,
            shippingCharge: finalShippingCharge,
            cartTotal: cart.total
        });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update quantity',
            error: error.message
        });
    }
}

const placeOrder = async (req, res) => {
    try {
        const { deliveryAddress, paymentMethod, items, totalAmount, couponDiscountValue, couponCode } = req.body;
        const userId = req.session.user_id;

        console.log("fasdfasdfasdfasdfasdfasdfasdfasdf", deliveryAddress);

        const coupon = await Coupon.findOne({ code: couponCode });

        console.log("coupon ==========================> ", couponDiscountValue)

        const address = await Address.findOne({ userId });
        const findAddress = address.address.find(a => a._id.toString() === deliveryAddress._id);

        console.log('finddddddAddressss', findAddress)

        const orderItems = items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.totalPrice
        }))

        console.log('items order ------ >', orderItems)

        const newOrder = new Order({
            userId,
            deliveryAddress: findAddress,
            items: orderItems,
            totalAmount,
            offerApplied: couponDiscountValue ? couponDiscountValue : 0,
            couponApplied: coupon,
            paymentMethod: paymentMethod
        })


        for (const item of orderItems) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for product ${product.name}` });
            }
            product.quantity -= item.quantity;
            await product.save();
        }

        await newOrder.save();



        if (coupon) {
            await Users.findByIdAndUpdate(userId, {
                $push: { couponUsed: coupon._id }
            });
        }

        await Cart.findOneAndUpdate(
            { userId },
            { $set: { items: [] } }
        );

        console.log("newwwwwwwwwwwwwwwwwwwwww order ====> ", newOrder)


        return res.status(200).json({ message: 'Order placed successfully', orderId: newOrder._id })
    } catch (error) {
        console.log(error.message)
    }
}

const orderConfirm = (req, res) => {
    try {
        const orderId = req.params.id;
        return res.render('user/order-confirm', { orderId })
    } catch (error) {
        console.log(error.message)
    }
}


// Order Tracking Page

const orderTracking = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const orderId = req.params.id;

        // Find the order and populate all necessary fields
        const order = await Order.findById(orderId)
            .populate({
                path: 'items.productId',
                select: 'productName images price description'
            })
            .populate({
                path: 'userId',
                select: 'fname lname email'
            });

        if (!order || order.userId._id.toString() !== userId) {
            let errorMessage = { message: "Order not found or unauthorized access" };
            return res.render('user/error', { error: errorMessage });
        }

        const user = await Users.findById(userId);
        const categories = await Category.find({});

        const statusProgress = {
            'Ordered': 25,
            'Shipped': 50,
            'Out For Delivery': 75,
            'Delivered': 100,
            'Cancelled': 0
        };

        const breadcrumbs = [
            { text: 'Home', url: '/home', icon: 'fas fa-home' },
            { text: 'Orders', url: '/orders' },
            { text: `Order #${order._id.toString().slice(-6)}`, url: null }
        ];

        console.log("////////////////////", order.deliveryAddress)

        return res.render('user/order-tracking', {
            user,
            categories,
            breadcrumbs,
            order: {
                ...order._doc,
                statusProgress: statusProgress[order.orderStatus],
                formattedDate: new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            }
        });

    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


module.exports = {
    getCartCount,
    getCart,
    deleteCart,
    addToCart,
    getCheckOut,
    orderTracking,
    placeOrder,
    orderConfirm,
    updateQuantity
}