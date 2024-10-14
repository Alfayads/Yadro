const bcrypt = require('bcrypt');
const OTP = require('otp-generator');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer')

// Models 
const Users = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Wishlist = require('../models/Wishlist');


//Secure Password
const securePassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.log(error.message);
    }
}

// Otp generator function
const generateOtp = () => {
    let otp = OTP.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    return otp;
}

// Email Sent function 

const sendVerificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.MAIL_EMAIL,
                pass: process.env.MAIL_PASS,
            }
        })

        const mailInfo = await transporter.sendMail({
            from: process.env.MAIL_EMAIL,
            to: email,
            subject: 'YADRO EMAIL VERIFICATION',
            html: `
            <h1> WELCOME TO YADRO </h1>
            <h3> Your OTP is ${otp} </h3>
            <p style="color: red"> Don't share this otp to anyone !!! </p>
            `
        })
        console.log('Email Info : ', mailInfo);
        return mailInfo.accepted.length > 0;
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getHomeWithUser = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const products = await Product.find({}).limit(4);
        const categories = await Category.find({});
        const user = await Users.findById({ _id: userId });
        return res.render('user/home-with-user', { products, categories, user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const productDetails = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById({ _id: id });
        const category = await Category.findById({ _id: product.category })
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id }
        }).limit(4);

        if (!product) {
            req.flash('error_msg', 'Something went wrong!!');
            return res.redirect('/');
        }
        return res.render('user/single-product', { product, category, user, relatedProducts });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getProductByCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const category = await Category.findById({ _id: id });
        const products = await Product.find({ category: id })
        return res.render('user/productByCategory', { products, category, user })
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getCart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        return res.render('user/cart', { user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getWishList = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const wishlist = await Wishlist.findOne({ userId }).populate('products');

        const wishlistProducts = wishlist ? wishlist.products : [];

        if (wishlist && wishlist.products.length > 0) {
            // Use the `productId` array to fetch product details
            const productIds = wishlist.products.map(item => item.productId);
            const products = await Product.find({ _id: { $in: productIds } });

            // Now render the wishlist EJS page with product details
            res.render('user/wishlist', { wishlistProducts: products, user });
        } else {
            res.render('user/wishlist', { wishlistProducts: [], user }); // empty wishlist
        }
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getWishlistCount = async (req, res) => {
    try {
        // Ensure the user is logged in with a valid session
        const userId = req.session.user_id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // Find the user's wishlist
        const wishlist = await Wishlist.findOne({ userId });
        const wishlistCount = wishlist ? wishlist.products.length : 0;

        return res.status(200).json({ success: true, wishlistCount });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Error fetching wishlist count' });
    }
};

const addWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log(productId);
        const userId = req.session.user_id;
        const productObjectId = new mongoose.Types.ObjectId(productId);

        // Find the user's wishlist
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            // Create a new wishlist if one doesn't exist
            wishlist = new Wishlist({
                userId,
                products: [{ productId: productObjectId }],
            });
        } else {
            // Check if the product is already in the wishlist
            const isProductInWishlist = wishlist.products.some(
                (item) => item.productId.equals(productObjectId)
            );

            // Add the product if it's not already in the wishlist
            if (!isProductInWishlist) {
                wishlist.products.push({ productId: productObjectId });
            }
        }

        // Save the wishlist
        await wishlist.save();

        // Send a success response
        return res.status(200).json({
            success: true,
            message: "Product added to wishlist successfully.",
        });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.status(500).json({ success: false, error: errorMessage });
    }
};



const removeWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.session.user_id;
        const productObjectId = new mongoose.Types.ObjectId(productId);

        // Find the user's wishlist
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found.",
            });
        }

        // Check if the product is in the wishlist
        const productIndex = wishlist.products.findIndex(
            (item) => item.productId.equals(productObjectId)
        );

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist.",
            });
        }

        // Remove the product from the wishlist
        wishlist.products.splice(productIndex, 1);

        // Save the updated wishlist
        await wishlist.save();

        // Send a success response
        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully.",
        });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.status(500).json({ success: false, error: errorMessage });
    }
};


const getCheckOut = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        return res.render('user/checkout', { user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const orderTracking = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        return res.render('user/order-tracking', { user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getOrders = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        return res.render('user/orders', { user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getAccount = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        return res.render('user/Account', { user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getWallet = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        return res.render('user/wallet', { user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        return res.render('user/transaction-history', { user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getAddress = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        return res.render('user/address-book', { user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        return res.render('user/all-products', { products, user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getContact = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        return res.render('user/contact', { user });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getHomeWithoutUser = async (req, res) => {
    try {
        const products = await Product.find({}).limit(4);
        const categories = await Category.find({});
        return res.render('user/home-without-user', { products, categories })
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }

}


const getSignup = (req, res) => {
    try {
        return res.render('user/signup');
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }

}



const newUser = async (req, res) => {

    const { fname, lname, email, password, phone, cpassword, gender } = req.body;
    console.log(fname, lname, email, password, phone, cpassword, gender);

    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const Emailregex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    try {

        if (password !== cpassword) {
            req.flash('error_msg', 'Password does Not Match Enter Correctly!!');
            return res.redirect('/signup');
        }

        if (phone.length < 10) {
            req.flash('error_msg', 'Phone Number Length Must be 10 Number');
            return res.redirect('/signup');
        }

        if (!Emailregex.test(email)) {
            req.flash('error_msg', ' Invalid Gmail address. Please enter a valid Gmail address.');
            return res.redirect('/signup');
        }

        if (!regex.test(password)) {
            req.flash('error_msg', 'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.');
            return res.redirect('/signup');
        }

        if (!fname || !email || !gender) {
            req.flash('error_msg', 'All fields Are required..');
            return res.redirect('/signup');
        }

        const existUser = await Users.findOne({ email });
        if (existUser) {
            req.flash('error_msg', 'User is already registered Login now !!');
            return res.redirect('/signup')
        }

        const otp = generateOtp();
        console.log(otp);

        const sendEmail = await sendVerificationEmail(email, otp);
        console.log(sendEmail);


        if (!sendEmail) {
            req.flash('error_msg', 'Email Not Sent !! Please try again');
            return res.redirect('/signup')
        }

        req.session.otp = otp;
        req.session.user = { fname, lname, gender, email, password, phone };
        req.flash('success_msg', 'OTP Sent Successfully Check Your Email !!! ');
        res.redirect('/otp-verify');
        console.log('OTP => ', otp)

    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getLogin = (req, res) => {
    try {
        return res.render('user/login')
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const checkUser = async (req, res) => {
    const Emailregex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    try {
        const { email, password } = req.body;
        const ifUser = await Users.findOne({ email });

        if (!Emailregex.test(email)) {
            req.flash('error_msg', 'Enter Valid Email id!!');
            return res.redirect('/login');
        }

        if (!ifUser) {
            req.flash('error_msg', 'User is Not Found!!');
            return res.redirect('/login');
        }

        if (ifUser.isBlocked) {
            req.flash('error_msg', `${ifUser.fname} ${ifUser.lname} is Blocked By Admin`);
            return res.redirect('/login');
        }

        req.session.user_id = ifUser._id;
        return res.redirect('/home');
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const forgotPassword = (req, res) => {
    try {
        return res.render('user/email-reset-password');
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getLogout = (req, res) => {
    try {
        req.flash('success_msg', 'Logout Successfully !!!')
        req.session.destroy((err) => {
            if (err) {
                req.flash('error_msg', 'Something wrong Please Try again...')
                return res.redirect('/home');
            }
            return res.redirect('/login');
        })

    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const getOtpVerify = async (req, res) => {
    try {
        return res.render('user/otp-verify')
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const enteredOtp = String(otp).trim();
        const sessionOtp = String(req.session.otp).trim();
        console.log('enteredOtp =>', enteredOtp);
        console.log('sessionOtp => ', sessionOtp);


        if (enteredOtp === sessionOtp) {
            const user = req.session.user;
            console.log(user);
            const passwordHash = await securePassword(user.password);
            const { fname, lname, email, phone, gender } = user;
            const saveUserData = new Users({
                fname,
                lname,
                gender,
                email,
                phone,
                verify: true,
                password: passwordHash
            });
            if (!user.googleId) {
                user.googleId = undefined;
            }
            await saveUserData.save();
            req.flash('success_msg', `Welcome ${fname} ${lname} Login to Your account ...`);
            res.redirect('/login')
        } else {
            req.flash('error_msg', 'OTP is Incorrect !! Try again ');
            res.redirect('/otp-verify');
        }
    } catch (err) {
        console.error(err.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const resendOtp = async (req, res) => {
    try {
        const { email } = req.session.user;
        if (!email) {
            req.flash('error_msg', 'Email not found!');
            return res.redirect('/otp-verify');
        }

        // Generate a new OTP
        const otp = generateOtp();
        req.session.otp = otp;
        const emailSent = await sendVerificationEmail(email, otp);

        if (emailSent) {
            console.log('OTP resent => ', otp);
            req.flash('success_msg', 'OTP has been resent successfully. Check your email!');
        } else {
            console.log('OTP resend failed.');
            req.flash('error_msg', 'OTP resend failed. Please try again.');
        }

        return res.redirect('/otp-verify');

    } catch (error) {
        console.error(error.message);
        const errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
};


module.exports = {
    getSignup,
    getLogin,
    forgotPassword,
    getHomeWithoutUser,
    getHomeWithUser,
    productDetails,
    getAllProducts,
    getProductByCategory,
    getCart,
    getWishList,
    getWishlistCount,
    addWishlist,
    removeWishlist,
    getCheckOut,
    orderTracking,
    getOrders,
    getAccount,
    getWallet,
    getTransactionHistory,
    getAddress,
    getContact,
    newUser,
    getLogout,
    checkUser,
    getOtpVerify,
    verifyOtp,
    resendOtp
}