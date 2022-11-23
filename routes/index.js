const express = require("express");
const router = express.Router();
const user = require("./user");
router.use("/auth", user);

module.exports = router;
