const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const nocache = require('nocache');
const keys = require('./config/keys');
const path = require('path')

dotenv.config();
const app = express();
// Initialising Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))
app.use(nocache());
app.use(express.json());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// static folder and ejs setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Router Setup

app.use('/', userRouter);
app.use('/admin', adminRouter);

//Listening to the port
app.listen(keys.port, err => {
    if (err) throw err;
    console.log(`Server Started at http://localhost:${PORT}`);
})