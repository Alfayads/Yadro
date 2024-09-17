const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: false
    },
    enable: {
        type: Boolean,
        required: true,
        default: false
    },
    gender: {
        type: String,
        required: true
    }

})

const user = mongoose.model('Users', userSchema);
module.exports = user;