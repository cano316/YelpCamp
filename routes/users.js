const express = require('express');
const { redirect } = require('express/lib/response');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const passport = require('passport');



router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        req.flash('success', 'Welcome to Yelp Camp');
        res.redirect('/campgrounds');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register')
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    req.flash('success', 'Welcome back!')
})






module.exports = router;