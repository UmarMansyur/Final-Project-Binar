const express = require("express");
const router = express.Router();
const cont = require("../controllers/user");
const multer = require("multer");
const upload = multer();
const imagekit = require("../utils/imagekit");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");
const storage = require("../utils/storage");

router.get("/myTicket", middle(roles.user), cont.passenger.show);
router.post("/data", middle(roles.user), cont.passenger.passenger);

module.exports = router;
