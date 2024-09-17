const express = require('express');
const admin_router = express.Router();

admin_router.get('/', (req, res) => {
    res.send('welcome to the adming page')
})


module.exports = admin_router;