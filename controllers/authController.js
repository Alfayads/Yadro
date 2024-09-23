const Users = require('../models/User');
const bcrypt = require('bcrypt');
const OTP = require('otp-generator');
const nodemailer = require('nodemailer');

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


const getHomeWithUser = (req, res) => {
    try {
        return res.render('user/home-with-user');
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getHomeWithoutUser = (req, res) => {
    try {
        return res.render('user/home-without-user')
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
        req.session.user = email;
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

        req.session.user = email;
        return res.redirect('/home');
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
        res.render('user/otp-verify')
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

module.exports = {
    getSignup,
    getLogin,
    getHomeWithoutUser,
    getHomeWithUser,
    newUser,
    getLogout,
    checkUser,
    getOtpVerify
}