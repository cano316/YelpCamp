module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You need be logged in for that.');
        // Use return to call out of the function and end it, so as
        // to not trigger the next() function.
        return res.redirect('/login')
    }
    // Otherwise, next to the logic from the route handler.
    next();
}

// module.exports = isLoggedIn;

module.exports.checkReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}