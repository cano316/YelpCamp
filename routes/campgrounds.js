const express = require('express');
const router = express.Router();
// We are now nested in a routes folder, so we have to go back up one directory using '../'
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const { campgroundSchema, reviewSchema } = require('../schemas');
const Campground = require('../models/campground');
const { application } = require('express');

// Middleware
const { isLoggedIn } = require('../middleware');
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    // Find the 50 campgrounds from our DB
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const { campground } = req.body;
    const userGC = new Campground(campground);
    // userGC.author = req.user._id;
    await userGC.save();
    req.flash('success', 'Added new campground!');
    res.redirect(`/campgrounds/${userGC._id}`);
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundCG = await Campground.findById(id).populate('reviews').populate('author');
    if (!foundCG) {
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground: foundCG })
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCG = await Campground.findById(id);
    if (!foundCG) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds')
    }
    if (!foundCG.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    res.render('campgrounds/edit', { campground: foundCG })
}));

router.patch('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    const foundCG = await Campground.findById(id);
    if (!foundCG.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    const campgroundToUpdate = await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });
    // const foundCG = await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });
    req.flash('success', 'Campground has been successfully updated.')
    res.redirect(`/campgrounds/${foundCG._id}`);
}));

// Delete
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.')
    res.redirect('/campgrounds')
}));

module.exports = router; 