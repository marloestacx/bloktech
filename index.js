const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const slug = require('slug');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv').config()


const geslacht = ["man","vrouw", "allebei"];
const leeftijd = ["20-30", "30-40", "40-50", "50+"];

//alles nl of engels

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
  let profielen = {}
  // look for alle profielen in database and sort them by name into an array

  db.collection('voorkeur').findOne({}, async function(err, result) {
    if (err) throw err;
    console.log(result.geslacht);

  // var query = { geslacht: result.geslacht};  

  // look for alle profielen in database and sort them by name into an array
  var query = { geslacht: result.geslacht, leeftijdcategory: result.leeftijd};  
  
  // console.log(db.collection('preference').find(range).toArray());
  profielen = await db.collection('profielen').find(query).toArray();
  res.render('home', {title:'List of all profielen', profielen})
  console.log(query);
  });
});

app.get('/filter', (req, res) => {
  // let voorkeur = {}
  // voorkeur =  db.collection('preference').find({},{sort: {geslacht: 1}}).toArray();
  res.render('filter',{geslacht, leeftijd});
});

app.post('/filter', async (req,res) => {
  const id = slug(req.body.geslacht);
  // const voorkeur = {"id": "id", "geslacht": req.body.geslacht, "leeftijd": req.body.leeftijd};
  // await db.collection('voorkeur').insertOne(voorkeur);

  await db.collection("voorkeur")
        .findOneAndUpdate(
            { id: "id" },
            { $set: {"geslacht": req.body.geslacht, "leeftijd": req.body.leeftijd }},
            { new: true, upsert: true, returnOriginal: false })

  res.render('home', {title: "Added a new movie"})
});

// app.get('/profiles', (req, res) => {
//   res.render('profiles', {title: "Profiel", profiles})
// })

// app.get('/profiles/add', (req, res) => {
//   res.render('add', {title: "Add profile"});
// });

// app.post('/profiles/add', (req,res) => {
//   const id = slug(req.body.name);
//   const profile = {"id": "id", "name": req.body.name, "age": req.body.age, "description": req.body.description};
//   profiles.push(profile);
//   res.render('profiledetails', {title: "Added a new profile", profile})
// });

// app.get('/profiles/:profileId', (req, res) => {
//   const profile = profiles.find( profile => profile.id == req.params.profileId);
//   res.render('profiledetails', {title: "Profile details", profile})
// });

app.use(function (req, res, next) {
  res.status(404).send("Deze pagin kan niet gevonden worden!");
});

app.listen(3000, () => {
  console.log('Express web app on localhost:3000');
});