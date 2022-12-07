const express = require("express");
const router = express.Router();
const user = require("./user");
const auth = require("./auth");
const airport = require("./airport");
const passenger = require("./passenger");
const flight = require("./flight");
const notification = require("./notification");

router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Welcome to Terbang Tinggi API",
  });
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/airport", airport);
router.use("/passenger", passenger);
router.use("/flight", flight);
router.use("/notification", notification);

module.exports = router;
