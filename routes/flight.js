const express = require("express");
const router = express.Router();
const cont = require("../controllers/admin");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

router.post("/data", middle([roles.admin]), cont.flight.create);

router.get("/data", middle([roles.admin]), cont.flight.read);

router.get("/data/:flightId", cont.flight.readDetailFlight);

router.put("/data/:flightId", middle([roles.admin]), cont.flight.update);

router.delete("/data/:flightId", middle([roles.admin]), cont.flight.delete);

module.exports = router;
