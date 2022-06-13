const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Restaurant = require('../models/restaurant');

mongoose.connect('mongodb://127.0.0.1:27017/restaurants', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];



const seedDB = async () => {
    console.log("deleting")
    await Restaurant.deleteMany({});
    console.log("deleted")
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const newRestaurant = new Restaurant({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            name: `${sample(descriptors)} ${sample(places)}`
        })
        await newRestaurant.save();
        console.log(i)
    }
}

seedDB().then(() => {
    console.log("closing" )
    mongoose.connection.close();
})