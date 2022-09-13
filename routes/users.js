const express = require('express');
const { redirect } = require('express/lib/response');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users')
const { checkReturnTo } = require('../middleware');



router.get('/register', users.getRegistrationForm)

router.post('/register', catchAsync(users.createAccount));

router.get('/login', users.renderLoginPage)

router.post('/login', checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// Logout

router.get('/logout', users.logout)

module.exports = router;