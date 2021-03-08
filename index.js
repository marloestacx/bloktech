const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const slug = require('slug');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv').config()

const geslacht = ["man","vrouw"];
const leeftijd = ["20-30", "30-40", "40-50", "50+"];
var gebruiker = 1;

console.log(gebruiker);
let db = null;
async function connectDB () {
  // URI van .env bestand
  const uri = process.env.DB_URI
  // connectie met database
  const options = { useUnifiedTopology: true };
  const client = new MongoClient(uri, options)
  await client.connect();
  db = await client.db(process.env.DB_NAME)
}
connectDB()
  .then(() => {
    // als er verbinding is
    console.log('We have a connection to Mongo!')
  })
  .catch( error => {
    // als er geen verbinding is
    console.log(error)
  });

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', async (req, res) => {
  let profielen = {}

  //haalt je voorkeur uit de database
  db.collection('voorkeur').findOne({}, async function(err, result) {
    if (err) throw err;
    var filter = {geslacht: result.geslacht, leeftijdcategory: result.leeftijd}; 
    // haalt alle profielen uit de database op en stopt ze in een array
    profielen = await db.collection('profielen').find(filter).toArray();
    res.render('home', {profielen})
  });
});

app.get('/filter', (req, res) => {
  res.render('filter',{geslacht, leeftijd});
});

app.post('/filter', async (req,res) => {
  const id = slug(req.body.geslacht);
  await db.collection("voorkeur").findOneAndUpdate({ id: gebruiker },{ $set: {"geslacht": req.body.geslacht, "leeftijd": req.body.leeftijd }},{ new: true, upsert: true, returnOriginal: false })
  res.redirect('/')
});

app.use(function (req, res, next) {
  res.status(404).send("Deze pagin kan niet gevonden worden!");
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Express web app on localhost:3000');
});
