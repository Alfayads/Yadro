require('dotenv').config();

module.exports = {
    sessionSecret: process.env.SESSION_SECRET,
    mongodb: process.env.MONGO_URL,
    port: process.env.PORT
}