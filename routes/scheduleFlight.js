const express = require("express");
const router = express.Router();
const cont = require("../controllers");

router.get("/search", cont.scheduleFlight.showFilter);

module.exports = router;
