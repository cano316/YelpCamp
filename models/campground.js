const mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = mongoose;

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId, ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, ref: 'Review'
        }
    ]
});

// Whenever a findoneanddelete query is called on a specific campground, we will also delete all reviews associated with that campground.
campgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews.length) {
        const response = await Review.deleteMany({ _id: { $in: campground.reviews } });
        console.log(response)
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;