const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utilities/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');


const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


main().catch(e => console.log(e))
async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log('Connected to MongoDB')
};

// Body Parser
app.use(express.urlencoded({ extended: true }));
// Method Override
app.use(methodOverride('_method'));
// Serve static files
app.use(express.static(__dirname + '/public'))
// Use Flash
app.use(flash());
//Session
const sessionConfig = {
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}
app.use(session(sessionConfig))

// Views
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views')

// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})

// Campground Routes

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// Routes
app.get('/', (req, res) => {
    res.render('home');
    req.flash('welcome', 'Welcome!')
});




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});


// Error Handling
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong...'
    res.status(status).render('error', { err });
});

// Listen
app.listen(PORT, function () {
    console.log(`LISTENING ON PORT: ${PORT}`)
});