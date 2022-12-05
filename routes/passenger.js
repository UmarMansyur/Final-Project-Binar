const express = require("express");
const router = express.Router();
const cont = require("../controllers");

router.get("/show/:id", cont.passenger.show);

module.exports = router;
