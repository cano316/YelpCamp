const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    // Find the 50 campgrounds from our DB
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createNewCampground = async (req, res, next) => {
    const { campground } = req.body;
    const userGC = new Campground(campground);
    userGC.author = req.user._id;
    await userGC.save();
    req.flash('success', 'Added new campground!');
    res.redirect(`/campgrounds/${userGC._id}`);
};

module.exports.renderShowPage = async (req, res, next) => {
    const { id } = req.params;
    const foundCG = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!foundCG) {
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground: foundCG })
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCG = await Campground.findById(id);
    if (!foundCG) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground: foundCG })
};

module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    const { campground } = req.body;
    const foundAndUpdatedCampground = await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });
    // const foundCG = await Campground.findByIdAndUpdate(id, campground, { runValidators: true, new: true });
    req.flash('success', 'Campground has been successfully updated.')
    res.redirect(`/campgrounds/${foundAndUpdatedCampground._id}`);
};

module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground.')
    res.redirect('/campgrounds')
};