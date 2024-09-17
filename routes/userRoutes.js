const express = require('express');
const user_router = express.Router();

const Controller = require('../controllers/userController');

user_router.get('/', Controller.loadHome);


module.exports = user_router;