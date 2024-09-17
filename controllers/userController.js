const loadHome = (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    loadHome
}