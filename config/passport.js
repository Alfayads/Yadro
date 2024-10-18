const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const env = require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/google/callback',
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        console.log('Profile:', profile);
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user);
        } else {
            user = new User({
                fname: profile._json.given_name,
                lname: profile._json.family_name,
                email: profile.emails[0].value,
                googleId: profile.id
            });
            console.log("New user object before save:", user);
            await user.save();
            console.log('Saved User : ', user)
            return done(null, user);
        }
    } catch (error) {
        console.error('Error during token exchange:', error);
        return done(error, null);
    }
}));


passport.serializeUser((user, done) => {
    console.log('Serializing user:', user);
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    console.log('Deserializing user with ID:', id);
    try {
        const user = await User.findById(id);
        console.log('Retrieved user:', user);
        done(null, user);
    } catch (err) {
        console.error('Error retrieving user:', err);
        done(err);
    }
});

module.exports = passport;