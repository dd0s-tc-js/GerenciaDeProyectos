const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const ejs = require('ejs');
const app = express();
const session = require('express-session');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.use(session({
  secret: 'mi-secreto', // Cadena secreta para firmar la cookie de sesión
  resave: false,
  saveUninitialized: true
}));

app.use('/', routes);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});