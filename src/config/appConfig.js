require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require("cookie-parser");

const configureApp = () => {
  const app = express();

  mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

  const allowedOrigins = process.env.FRONTEND_URL.split(",");
  console.log("CORS Origin:", process.env.FRONTEND_URL);

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  };
  
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // Handle preflight
  
  app.use(cookieParser());
  app.set("trust proxy", 1);


  app.use(express.json()); // Used when parsing JSON in client side
  app.use(express.urlencoded({ extended: true })); // Used when reading directly from form
  
  
  return app;
};

module.exports = {
  configureApp
};
