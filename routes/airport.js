const express = require("express");
const router = express.Router();
const cont = require("../controllers");

router.get("/search/:search", cont.airport.getPort);

module.exports = router;
