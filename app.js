const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const ConnectDB = require('./config/db');
const passport = require('./config/passport');
const nocache = require('nocache');
const flash = require('connect-flash');
const keys = require('./config/keys');
const path = require('path')


const app = express();
// Initialising Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next()
})

ConnectDB();

app.use(nocache());
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// static folder and ejs setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'uploads')));

//Router Setup

app.use('/', userRouter);
app.use('/admin', adminRouter);

//Listening to the port
app.listen(keys.port, err => {
    if (err) throw err;
    console.log(`Server Started at http://localhost:${keys.port}`);
})