const express = require("express");
const router = express.Router();
const cont = require("../controllers");

router.get("/search/:search", cont.port.getPort);

module.exports = router;