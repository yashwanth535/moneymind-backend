require('dotenv').config();
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const session = require('express-session')
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const configureApp = () => {
  const app = express();

  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

  app.set("trust proxy", 1);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'sldkfjsdhkjsdh23498uasjdhf', // Use a strong secret
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 15 * 24 * 60 * 60, // Session expiration time in seconds (15 days)
      autoRemove: 'interval',
      autoRemoveInterval: 15 // Minutes
    }),
    cookie: {
      secure: true, // Only use secure cookies in production
      sameSite: 'none', // Required for cookies to work cross-site in secure contexts
      maxAge: 15 * 24 * 60 * 60 * 1000 // Set cookie expiration time (15 days)
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
