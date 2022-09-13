const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
// Middleware
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');


router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground));

router.get('/:id', catchAsync(campgrounds.renderShowPage));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.patch('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCamp));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

module.exports = router; 