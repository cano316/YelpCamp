const express = require('express');
const { redirect } = require('express/lib/response');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users')
const { checkReturnTo } = require('../middleware');

router.route('/register')
    .get(users.getRegistrationForm)
    .post(catchAsync(users.createAccount))

router.route('/login')
    .get(users.renderLoginPage)
    .post(checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

module.exports = router;