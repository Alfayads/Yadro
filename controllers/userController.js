const Users = require('../models/User');
const Category = require('../models/Category');
const User = require('../models/User');


const getAccount = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        return res.render('user/Account', { user, categories });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}

const editProfile = async (req, res) => {
    try {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const userId = req.params.id;
        const { fname, lname, email, phone, gender } = req.body;
        console.log(fname, lname, email, phone, gender);

        const user = await Users.findById(userId);

        if (fname === user.fname && lname === user.lname && email === user.email && phone === user.phone && gender === user.gender) {
            req.flash('error_msg', 'There is no Change !! Please update the value to Continue');
            return res.redirect('/account')
        }

        if (!fname) {
            req.flash('error_msg', 'First Name is Required !!');
            return res.redirect('/account')
        }

        if (!emailRegex.test(email)) {
            req.flash('error_msg', 'Enter Valid Email Address');
            return res.redirect('/account')
        }

        if (phone.length < 10 || phone.length > 10) {
            req.flash('error_msg', 'Enter Valid Phone Number');
            return res.redirect('/account')
        }

        const newData = {
            fname,
            lname,
            email,
            phone,
            gender
        }

        await Users.findByIdAndUpdate(userId, newData, { new: true });
        req.flash('success_msg', 'Profile Edited Successfully..');
        return res.redirect('/account');


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
        const categories = await Category.find({});
        return res.render('user/wallet', { user, categories });
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
        const categories = await Category.find({});
        return res.render('user/transaction-history', { user, categories });
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
        const categories = await Category.find({});
        return res.render('user/contact', { user, categories });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


module.exports = {
    getAccount,
    editProfile,
    getContact,
    getTransactionHistory,
    getWallet
}
