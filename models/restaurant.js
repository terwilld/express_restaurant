const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
    name: String,
    foodType: String,
    description: String,
    location: String
})

module.exports = mongoose.model('Restaurant', RestaurantSchema)