const mongoose = require('mongoose');
const keys = require('./keys');

const ConnectDB = async () => {
    try {
        await mongoose.connect(keys.mongodb);
        console.log('MONGODB Connected Successfully...')
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = ConnectDB;