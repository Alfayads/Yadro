const getSignup = (req, res) => {
    res.render('user/signup');
}

const getLogin = (req, res) => {
    res.render('user/login')
}

module.exports = {
    getSignup,
    getLogin
}