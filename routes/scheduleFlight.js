const express = require("express");
const router = express.Router();
const cont = require("../controllers/user");

router.get("/search", cont.scheduleFlight.showFilter);
router.get("/search/:flightId", cont.scheduleFlight.detailFlight)

module.exports = router;
