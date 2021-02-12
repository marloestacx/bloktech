const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');

const profile = [
  {name: "Piet", age: 25, description: "Houdt van voetbal"},
  {name: "Jan", age: 54, description: "Houdt van gamen"},
  {name: "Klaas", age: 23, description: "Houdt van sporten"},
]

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.render('home',{});
});

app.get('/login', (req, res) => {
  res.send('Login pagina');
});

app.get('/profile', (req, res) => {
  res.render('profile', {title: "Profiel", profile})
})

app.use(function (req, res, next) {
  res.status(404).send("Deze pagin kan niet gevonden worden!");
});

app.listen(3000, () => {
  console.log('Express web app on localhost:3000');
});