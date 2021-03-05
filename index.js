const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const slug = require('slug');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv').config()


const geslacht = ["man", "vrouw", "allebei"];
const leeftijd = ["20-30", "30-40", "40-50", "50+"];

// const profiles = [
//   {name: "Piet", age: 25, description: "Houdt van voetbal"},
//   {name: "Jan", age: 54, description: "Houdt van gamen"},
//   {name: "Klaas", age: 23, description: "Houdt van sporten"},
// ]

//alles nl of engels
const voorkeuren = [
  { geslacht: ["man"], leeftijd: ["20-30"]}
];

let db = null;
// function connectDB
async function connectDB () {
  // get URI from .env file
  const uri = process.env.DB_URI
  // make connection to database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options)
  await client.connect();
  db = await client.db(process.env.DB_NAME)
}
connectDB()
  .then(() => {
    // if succesfull connections is made, show a message
    console.log('We have a connection to Mongo!')
  })
  .catch( error => {
    // if connnection is unsuccesful, show errors
    console.log(error)
  });

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// app.get('/', (req, res) => {
//   res.render('home',{});
// });

app.get('/', async (req, res) => {
  // create an empty list of profiles
let profiles = {}
// look for alle profielen in database and sort them by name into an array
profiles = await db.collection('profiles').find({},{sort: {name: 1}}).toArray();
res.render('home', {title:'List of all profiles', profiles})
});

app.get('/filter', (req, res) => {
  res.render('filter',{voorkeuren});
});

app.get('/profiles', (req, res) => {
  res.render('profiles', {title: "Profiel", profiles})
})

app.get('/profiles/add', (req, res) => {
  res.render('add', {title: "Add profile"});
});

app.post('/profiles/add', (req,res) => {
  const id = slug(req.body.name);
  const profile = {"id": "id", "name": req.body.name, "age": req.body.age, "description": req.body.description};
  profiles.push(profile);
  res.render('profiledetails', {title: "Added a new profile", profile})
});

app.get('/profiles/:profileId', (req, res) => {
  const profile = profiles.find( profile => profile.id == req.params.profileId);
  res.render('profiledetails', {title: "Profile details", profile})
});

app.use(function (req, res, next) {
  res.status(404).send("Deze pagin kan niet gevonden worden!");
});

app.listen(3000, () => {
  console.log('Express web app on localhost:3000');
});