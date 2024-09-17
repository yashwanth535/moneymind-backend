// appConfig.js
require('dotenv').config();
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyParser=require("body-parser");
const mongoose = require('mongoose');
const User = require('../models/User');
const getExpenseModel = require('../models/expense');
const session = require('express-session');

const configureApp = () => {
  const app = express();

  // Set views path
  const viewsPath = path.join(__dirname, '../../template')
  const partialsPath = path.join(__dirname, "../../template/partials");

  console.log(viewsPath);
  // Set view engine
  app.set("view engine", "hbs");
  app.set("views", viewsPath);
  app.use(express.static(path.join(__dirname, '../../public')));
  
  // Register partials
  hbs.registerPartials(partialsPath);

  // Set static files directory
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());


   app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

// appConfig.js

// Middleware to check if the user is authenticated



  
 

  return app;
};


module.exports = {
  configureApp
};
