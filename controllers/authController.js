const bcrypt = require('bcrypt');
const OTP = require('otp-generator');
const nodemailer = require('nodemailer')

// Models 
const Users = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');


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
        const products = await Product.find({}).limit(3);
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        if (!product) {
            req.flash('error_msg', 'Something went wrong!!');
            return res.redirect('/');
        }
        return res.render('user/single-product', { product, products, category, user });
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
        console.log(error.message);
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
    try {

        if (password !== cpassword) {
            req.flash('error_msg', 'Password does Not Match Enter Correctly!!');
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
    try {
        const { email, password } = req.body;
        const ifUser = await Users.findOne({ email });

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
    newUser,
    getLogout,
    checkUser,
    getOtpVerify,
    verifyOtp,
    resendOtp
}