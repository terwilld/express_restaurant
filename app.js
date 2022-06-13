if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
    // console.log("test")
    // console.log(process)
    // console.log(process.env)
    // console.log(process.env.NODE_ENV)
    // console.log(process.env.DB_URL)
}


const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('./models/restaurant')
const methodOverride = require('method-override')

const app = express();
const path = require('path')
const dbURL = process.env.DB_URL  || 'mongodb://127.0.0.1:27017/yelp-camp'
console.log(`using this database: ${dbURL}`)




// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// } );

// mongoose.connect(dbURL,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// } );

mongoose.connect(dbURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
} );

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended : true }))
app.use(methodOverride('_method'));


app.get('/', (req,res) => {
//    res.send('hello from yelp camp')
    res.render('home')

})

app.get('/restaurants', async(req,res) => {
    const restaurants = await Restaurant.find({})
//    console.log(restaurants)
//    res.send(restaurants)
    res.render('restaurants/index', {restaurants})
})


app.post('/restaurants', async(req,res) => {
        const restaurantData = req.body.restaurant
        const newRestaurant = new Restaurant(restaurantData)
        await newRestaurant.save()
        res.redirect(`restaurants/${newRestaurant._id}`)
    })
    

app.get('/restaurants/new', (req,res) => {
    res.render('restaurants/new')
})

app.get('/restaurants/:id', async (req,res) => {
    const {id} = req.params
    const myRestaurant = await Restaurant.findById(id)
    res.render('restaurants/show',{myRestaurant})
})



app.get('/restaurants/:id/edit', async (req,res) => {
    const {id} = req.params
    const myRestaurant = await Restaurant.findById(id)
    res.render('restaurants/edit',{myRestaurant})
})


app.put('/restaurants/:id', async(req,res) => {
    console.log("test")
    console.log(req.params)
    const {id} = req.params
    console.log(id)
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant},{new:true})
    console.log(updatedRestaurant)
    res.redirect(`/restaurants/${updatedRestaurant._id}`)
//    res.send("IT WORKED")
})

app.delete('/restaurants/:id', async (req,res) =>{
    const {id} = req.params
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id)
    res.redirect('/restaurants/')
})




app.get('/makerestaurant', async (req,res) => {
    //    res.send('hello from yelp camp')
    console.time('test-save')
    const newRestaurant = new Restaurant({name:"Joe's smoke shack", foodType:"Casual", description: "fast casual wings", location: "Boston MA"})
    await newRestaurant.save()
    console.log(newRestaurant)
    console.log(console.timeEnd('test-save'))
    res.send(newRestaurant)


    // console.log('test')
    // res.render('home')
    })


const port = process.env.PORT || 4000
    app.listen(port, () => {
        console.log(`Serving on port ${port}`)
    })




// name: String,
// foodType: String,
// description: String,
// location: String
// })