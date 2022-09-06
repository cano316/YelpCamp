const express = require('express');
const router = express.Router();
// We are now nested in a routes folder, so we have to go back up one directory using '../'
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const { campgroundSchema, reviewSchema } = require('../schemas');
const Campground = require('../models/campground');

// Middleware
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

router.get('/new', (req, res) => {
    res.render('campgrounds/new');

});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    const { campground } = req.body;
    const userGC = new Campground(campground);
    await userGC.save();
    req.flash('success', 'Added new campground!')
    res.redirect(`/campgrounds/${userGC._id}`);
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundCG = await Campground.findById(id).populate('reviews');
    if (!foundCG) {
        throw new ExpressError('Could not find a product with that ID', 404);
    };
    res.render('campgrounds/show', { campground: foundCG })
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCG = await Campground.findById(id);
    res.render('campgrounds/edit', { campground: foundCG })
}));

router.patch('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    const foundCG = await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });
    res.redirect(`/campgrounds/${foundCG._id}`);
}));

// Delete
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}));

module.exports = router;