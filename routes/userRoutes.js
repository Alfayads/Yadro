const express = require('express');
const user_router = express.Router();

const authController = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

user_router.get('/', auth.isLogin, authController.getHomeWithoutUser)

user_router.get('/signup', auth.isLogin, authController.getSignup);
user_router.post('/signup', authController.newUser);

user_router.get('/login', auth.isLogin, authController.getLogin);

user_router.get('/logout', authController.getLogout);

user_router.get('/home', auth.isLogout, authController.getHomeWithUser);

module.exports = user_router;