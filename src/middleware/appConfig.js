// appConfig.js
require('dotenv').config();
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const session = require('express-session');

const configureApp = () => {
  const app = express();

  const viewsPath = path.join(__dirname, '../../template')
  const partialsPath = path.join(__dirname, "../../template/partials");


  app.set("view engine", "hbs");
  app.set("views", viewsPath);
  hbs.registerPartials(partialsPath);

  app.use(express.static(path.join(__dirname, '../../public')));
  app.use(express.urlencoded({ extended: true }));//used when reading directly from form
  app.use(express.json());//used when parsing in json in client side



  app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Use a secure key from environment variable
    resave: false,
    saveUninitialized: false, // Avoid creating session for unauthenticated users
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24 // 1 day expiration
    }
  }));
  return app;
};


module.exports = {
  configureApp
};
