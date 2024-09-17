const express = require('express');
const user_router = express.Router();

const authController = require('../controllers/authController');

user_router.get('/signup', authController.getSignup);
user_router.get('/login', authController.getLogin);

module.exports = user_router;