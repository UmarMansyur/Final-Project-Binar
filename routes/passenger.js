const express = require("express");
const router = express.Router();
const cont = require("../controllers/user");
const multer = require("multer");
const upload = multer();
const imagekit = require('../utils/imagekit');
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");
const storage = require('../utils/storage')

router.get("/myTicket", middle(roles.user), cont.passenger.show);
router.post('/upload-document', upload.single('image'), middle(roles.user), cont.passenger.uploadDocument);


module.exports = router;
