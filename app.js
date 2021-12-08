
const express = require('express');

const app =express();


const mongoose = require('mongoose');
const path = require('path');

//const stuffRoutes = require('./routes/stuff');
//const userRoutes = require('./routes/user');

require('dotenv').config();





mongoose.connect(process.env.MONGO_URI,
{ useNewUrlParser: true,
 useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// ** pour acceder au corp de la requette json  ****
  app.use(express.json());


// Middleware de paramétrage du CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
 // on autorise ce serveur à fournir des scripts pour la page visitée
 res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});

//pp.use('/images', express.static(path.join(__dirname, 'images')));
//app.use('/api/stuff', stuffRoutes);
//app.use('/api/auth', userRoutes);


module.exports = app;





