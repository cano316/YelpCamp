const express = require('express');
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas');
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');

// By default, we wont have access to req.params, because that {id} is being handled in the main app.js file, so we have
// to go to line 2, and set mergeParams equal to true to have access to id in this route handler,
//else, id will be null, and then campground will be null.
// await returns the value of a promise, in this case campground will be null, but we wont know/get an error
// until we try access reviews, when we finally get an error message. 
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
// Delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;