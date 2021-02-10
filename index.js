const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Express web app on localhost:3000');
});

app.get('/login', (req, res) => {
  res.send('Login pagina')
});

app.use(function (req, res, next) {
  res.status(404).send("Deze pagin kan niet gevonden worden!")
});
