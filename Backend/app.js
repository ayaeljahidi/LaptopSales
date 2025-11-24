const express = require('express');
const mongoose = require('mongoose');

const Thing = require('./models/things');

const app = express();

app.use(express.json());
const stuffRoutes = require('./routes/stuff');


//mongoDB
mongoose.connect('',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Erreurs de CORS pour acceder a api sans probleme
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//CRUD
app.use('/api/stuff', stuffRoutes);

module.exports = app;
