const User = require('../models/User');

const userAuth = (req, res, next) => {
    if (req.session.user) {
        User.findById(req.session.user)
            .then(data => {
                if (data && !data.isBlocked) {
                    next();
                } else {
                    res.redirect('/login');
                }
            })
            .catch((err) => {
                console.log("Error in User Auth Middleware ", err);
            })
    } else {
        res.redirect('/login');
    }
}


const adminAuth = (req, res, next) => {
    try {
        if (req.session.admin) {
            next();
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.log(error.message);
    }
}


// User.findOne({ isAdmin: true })
//     .then(data => {
//         if (data) {
//             next();
//         } else {
//             res.redirect('/admin/login');
//         }
//     })
//     .catch(err => {
//         console.log('Admin Auth middleware error ', err);
//     })

module.exports = {
    userAuth,
    adminAuth
}