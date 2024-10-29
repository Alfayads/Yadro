const Users = require('../models/User');
const Category = require('../models/Category');
const User = require('../models/User');
const Wallet = require('../models/wallet')
const Announcement = require('../models/announcement')


const getAccount = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const announcements = await Announcement.find({});
        return res.render('user/Account', { user, categories, announcements });
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
        const announcements = await Announcement.find({});
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const wallet = await Wallet.findOne({ userId })



        if (wallet && wallet.lastUpdated) {
            // Format the lastUpdated date
            const formattedDate = new Intl.DateTimeFormat('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }).format(wallet.lastUpdated);

            const formattedTime = new Intl.DateTimeFormat('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(wallet.lastUpdated);

            wallet.formattedLastUpdated = `${formattedDate}, ${formattedTime}`;
        }


        console.log(wallet)
        return res.render('user/wallet', { user, categories, wallet, announcements });
    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
}


const getWalletDetails = async (req, res) => {
    try {
        // Find the wallet by userId
        let wallet = await Wallet.findOne({ userId: req.user._id });

        // If no wallet is found, create a new one with an initial balance of 0
        if (!wallet) {
            wallet = new Wallet({
                userId: req.user._id,
                balance: 0,
                transactions: []
            });
            await wallet.save();
        }

        // Format the response data
        const responseData = {
            balance: wallet.balance,
            transactions: wallet.transactions.map(t => ({
                type: t.type,
                amount: t.amount,
                description: t.description,
                date: t.date.toLocaleDateString(),
                time: t.date.toLocaleTimeString()
            }))
        };

        // Send the wallet details as the response
        res.json(responseData);
    } catch (error) {
        console.error("Failed to retrieve wallet:", error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await Users.findById({ _id: userId });
        const categories = await Category.find({});
        const announcements = await Announcement.find({});
        return res.render('user/transaction-history', { user, categories, announcements });
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
        const announcements = await Announcement.find({});
        return res.render('user/contact', { user, categories, announcements });
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
    getWallet,
    getWalletDetails,
}
