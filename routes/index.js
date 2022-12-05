const express = require("express");
const router = express.Router();
const user = require("./user");
const auth = require("./auth");
const port = require("./port");
const passenger = require("./passenger");

router.get("/", (req, res) => {
  return res.status(200).json({
    status: true,
    message: "Welcome to Terbang Tinggi API",
  });
});

router.use("/auth", auth);
router.use("/user", user);
router.use("/airport", port);
router.use("/passenger", passenger);
module.exports = router;
