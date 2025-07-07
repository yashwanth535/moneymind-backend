// config/appConfig.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoConnect = require("./mongoConnect");

const configureApp = async () => {
  const app = express();

  // await mongoConnect(); // Connect here

  const allowedOrigins = process.env.FRONTEND_URL?.split(",") || [];
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
  app.options('*', cors(corsOptions));
  app.use(cookieParser());
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};

module.exports = {
  configureApp
};
