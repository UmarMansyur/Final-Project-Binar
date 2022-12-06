const express = require("express");
const router = express.Router();
const cont = require("../controllers");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

router.post("/data", middle([roles.admin]), cont.flight.create);

router.get("/data", middle([roles.admin]), cont.flight.read);

router.put("/data/:flightId", middle([roles.admin]), cont.flight.update);

router.delete("/data/:flightId", middle([roles.admin]), cont.flight.delete);

router.get("/myFlight/:id", middle([roles.user, roles.admin]), cont.flight.detailFlight);
module.exports = router;
