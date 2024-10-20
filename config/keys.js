require('dotenv').config();

module.exports = {
    sessionSecret: process.env.SESSION_SECRET,
    mongodb: process.env.MONGO_URL,
    port: process.env.PORT,
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
}