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
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

  return app;
};


module.exports = {
  configureApp
};
