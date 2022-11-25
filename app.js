require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const router = require("./routes");
const app = express();
const methodOverride = require('method-override');
const path = require('path')
const cors = require('cors');
const webpush = require('web-push');
const fs = require('fs');
const { HTTP_PORT = 3002 } = process.env;

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(router);
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// 404 handler
app.use((req, res, next) => {
  return res.status(404).json({
    status: false,
    message: "Are you lost?",
  });
});

// 500 handler
app.use((err, req, res, next) => {
  return res.status(500).json({
    status: false,
    message: err.message,
  });
});

app.listen(HTTP_PORT, () => console.log("listening on port", HTTP_PORT));
