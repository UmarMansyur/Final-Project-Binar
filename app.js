require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const router = require("./routes");
const app = express();
const { HTTP_PORT = 8080 } = process.env;
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const webpush = require("web-push");
const fs = require("fs");

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(router);
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "client")));

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

//User
//npx sequelize-cli model:generate --name User --attributes username:string,email:string,password:string,thumbnail:string,role:string,user_type:string,is_verified:integer

//DetailUser
//npx sequelize-cli model:generate --name DetailUser --attributes user_id:integer,fullName:string,gender:string,country:string,province:string,city:string,address:string,phone:string

//Notification
//npx sequelize-cli model:generate --name Notification --attributes user_id:integer,title:string,detail_message:text

//Flight
//npx sequelize-cli model:generate --name Flight --attributes airlineName:string,departureCity:string,arrivalCity:string,departureCity:string,departureTime:TIME,arrivalTime:string,totalSeat:integer,class:string,gate:string,boardingTime:TIME,price:integer,stock:integer

//transaction
//npx sequelize-cli model:generate --name Transaction --attributes user_id:integer,isPaid:boolean,roundTrip:DATE,oneWay:DATE

//passenger
//npx sequelize-cli model:generate --name Passenger --attributes  email:string,firstName:string,lastName:string,phone:string,type:string,travelDocument:string

//detail transaction
//npx sequelize-cli model:generate --name DetailTransaction --attributes transaction_id:integer,flight_id:integer,passenger_id:integer

//ticket
//npx sequelize-cli model:generate --name Ticket --attributes detail_transaction_id:integer,ticket_code:string
