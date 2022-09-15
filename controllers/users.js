const User = require('../models/user')

module.exports.getRegistrationForm = (req, res) => {
    res.render('users/register')
};

module.exports.createAccount = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        });

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register')
    }
};

module.exports.renderLoginPage = (req, res) => {
    res.render('users/login')
};

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectURL = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectURL);
};

module.exports.logout = (req, res) => {
    req.logout(err => {
        if (err) { return next(err) }
        req.flash('success', 'You have been logged out.')
        res.redirect('/campgrounds')
    });
};