const passport = require('passport');
const User = require('../models/User');
const keys = require('./keys');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: keys.GOOGLE_CLIENT_ID,
    clientSecret: keys.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
},
    async function (req, accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
                user = new User({
                    googleId: profile.id,
                    fname: profile.name.givenName,
                    lname: profile.name.familyName,
                    email: profile.emails[0].value,
                    verify: true
                });
                await user.save();
            }
            req.session.user_id = user._id; // Store user ID in session
            done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;