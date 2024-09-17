const mongoose = require('mongoose');
const keys = require('./keys');

const ConnectDB = async () => {
    try {
        await mongoose.connect(keys.mongodb).then((done) => {
            console.log('MONGODB Connected successfully..');
        });
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = ConnectDB;