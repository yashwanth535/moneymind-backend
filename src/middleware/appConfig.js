require('dotenv').config();
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

const configureApp = () => {
  const app = express();

  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your_random_secure_string', // Use a strong secret
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI, // Use the mongoUrl option
      collectionName: 'sessions' // Optional: specify collection name
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production' // Use secure cookies in production
    }
  }));

  const viewsPath = path.join(__dirname, '../../template');
  const partialsPath = path.join(__dirname, "../../template/partials");

  app.set("view engine", "hbs");
  app.set("views", viewsPath);
  hbs.registerPartials(partialsPath);

  app.use(express.static(path.join(__dirname, '../../public')));
  app.use(express.json()); // Used when parsing JSON in client side
  app.use(express.urlencoded({ extended: true })); // Used when reading directly from form


  // Connect to MongoDB
  

  return app;
};

module.exports = {
  configureApp
};
