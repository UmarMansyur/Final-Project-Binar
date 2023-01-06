const express = require("express");
const router = express.Router();
const user = require("./user");
const admin = require("./admin");
const auth = require("./auth");
const airport = require("./airport");
const passenger = require("./passenger");
const flight = require("./flight");
const notification = require("./notification");
const transaction = require("./transaction");
const schedule = require("./scheduleFlight");
const webpush = require("./webpush");
const ticket = require("./ticket");

router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    version: "1.0",
    message:
      "Welcome to Terbang Tinggi API (Final Project Backend Javascript Binar Academy) ",
    team: {
      1: "Achmad Fadilla",
      2: "John Tri Putra Sihombing",
      3: "Muhammad Umar Mansyur",
    },
    location: {
      country: "Indonesia",
      state: "Jakarta, Medan, Madura",
    },
  });
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/admin", admin);
router.use("/airport", airport);
router.use("/passenger", passenger);
router.use("/flight", flight);
router.use("/notification", notification);
router.use("/schedule", schedule);
router.use("/transaction", transaction);
router.use("/webpush", webpush);
router.use("/ticket", ticket);

module.exports = router;
