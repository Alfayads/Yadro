const Users = require('../models/User');
const bcrypt = require('bcrypt');

const getHomeWithUser = (req, res) => {
    try {
        return res.render('user/home-with-user');
    } catch (error) {
        res.send(error);
    }
}


const getHomeWithoutUser = (req, res) => {
    try {
        return res.render('user/home-without-user')
    } catch (error) {
        res.send(error);
    }

}

const getSignup = (req, res) => {
    try {
        return res.render('user/signup');
    } catch (error) {
        res.send(error);
    }

}

const newUser = async (req, res) => {
    const { fname, lname, email, password, verify, phone, cpassword, gender } = req.body;
    console.log(fname, lname, email, password, phone, cpassword, gender);

    if (password !== cpassword) {
        let error = { message: "Passwords do not match!" };
        return res.render('user/error', { error })
    }
    try {
        const existUser = await Users.findOne({ email });
        if (existUser) {
            let error = {
                message: "user is already registered with this email"
            }
            return res.render('user/error', { error })
        }

        const hashedPassword = await bcrypt.hash(password, 10)


        const newUser = new Users({
            fname,
            lname,
            email,
            phone,
            password: hashedPassword,
            gender
        });
        await newUser.save();

        req.session.user = email;
        return res.redirect('/home');

    } catch (error) {
        console.error(error.message);
        let errorMessage = { message: "An error occurred. Please try again later." };
        return res.render('user/error', { error: errorMessage });
    }
    req.session.user = fname;
    return res.redirect('/home')
}

const getLogin = (req, res) => {
    try {
        return res.render('user/login')
    } catch (error) {
        res.send(error);
    }

}

const getLogout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.redirect('/home');
            } else {
                res.redirect('/login');
            }
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    getSignup,
    getLogin,
    getHomeWithoutUser,
    getHomeWithUser,
    newUser,
    getLogout
}