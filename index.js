const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const slug = require('slug');

const profiles = [
  {name: "Piet", age: 25, description: "Houdt van voetbal"},
  {name: "Jan", age: 54, description: "Houdt van gamen"},
  {name: "Klaas", age: 23, description: "Houdt van sporten"},
]

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home',{});
});

app.get('/filter', (req, res) => {
  res.render('filter',{});
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