const express = require("express");
const router = express.Router();
const cont = require("../controllers/user");

router.get("/search/:search", cont.airport.getPort);
router.get("/indonesia", cont.airport.getIndoAirport);
router.get("/all", cont.airport.getAllAirport);

module.exports = router;
