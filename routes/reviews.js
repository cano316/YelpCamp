const express = require('express');
const router = express.Router({ mergeParams: true });
const { campgroundSchema, reviewSchema } = require('../schemas');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// By default, we wont have access to req.params, because that {id} is being handled in the main app.js file, so we have
// to go to line 2, and set mergeParams equal to true to have access to id in this route handler,
//else, id will be null, and then campground will be null.
// await returns the value of a promise, in this case campground will be null, but we wont know/get an error
// until we try access reviews, when we finally get an error message. 
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // res.send(`I see you want to leave a review for ${campground.title}`)
    const review = new Review(req.body.review);
    // review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review added!')
    res.redirect(`/campgrounds/${id}`)
}));
// Delete a review
router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review was deleted.')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;