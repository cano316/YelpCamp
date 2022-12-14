const mongoose = require('mongoose');
const cities = require('./cities')
const Campground = require('../models/campground');
const { descriptors, places } = require('./seedHelpers');


// Connect to Mongo
main().catch(e => console.log(e))
async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
    console.log('Connected to Mongo from Seeds');
}
// Grab a random city and add it to the database, 50 times
const sample = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
};
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const ranNum = Math.floor(Math.random() * 1000) + 1;
        const ranCity = cities[ranNum]
        const ranPrice = Math.floor(Math.random() * 200) + 20;
        const c = new Campground({
            location: `${ranCity.city}, ${ranCity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [ranCity.longitude, ranCity.latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dnibipwoi/image/upload/v1663274112/YelpCamp/z2nxol3g9wa6hwqihpnt.jpg',
                    filename: 'YelpCamp/z2nxol3g9wa6hwqihpnt'
                },
                {
                    url: 'https://res.cloudinary.com/dnibipwoi/image/upload/v1663274112/YelpCamp/q1rg6e26gzfztpliyihv.webp',
                    filename: 'YelpCamp/q1rg6e26gzfztpliyihv'
                },
                {
                    url: 'https://res.cloudinary.com/dnibipwoi/image/upload/v1663274112/YelpCamp/u6c7pxfeabxqtzqb1sym.jpg',
                    filename: 'YelpCamp/u6c7pxfeabxqtzqb1sym'
                }
            ],
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            author: '631bbddd1b32beca94efd744',
            price: ranPrice
        });
        await c.save();
    }

}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })
    .catch(e => console.log(e))