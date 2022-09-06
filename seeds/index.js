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
    for (let i = 0; i < 50; i++) {
        const ranNum = Math.floor(Math.random() * 1000) + 1;
        const ranCity = cities[ranNum]
        const ranPrice = Math.floor(Math.random() * 200) + 20;
        const c = new Campground({
            location: `${ranCity.city}, ${ranCity.state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem*5',
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