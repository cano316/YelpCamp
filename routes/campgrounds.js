const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
// Middleware
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');


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
    userGC.author = req.user._id;
    await userGC.save();
    req.flash('success', 'Added new campground!');
    res.redirect(`/campgrounds/${userGC._id}`);
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const foundCG = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!foundCG) {
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground: foundCG })
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCG = await Campground.findById(id);
    if (!foundCG) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground: foundCG })
}));

router.patch('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    const foundAndUpdatedCampground = await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });
    // const foundCG = await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });
    req.flash('success', 'Campground has been successfully updated.')
    res.redirect(`/campgrounds/${foundAndUpdatedCampground._id}`);
}));

// Delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.')
    res.redirect('/campgrounds')
}));

module.exports = router; 