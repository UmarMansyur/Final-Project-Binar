const express = require("express");
const router = express.Router();
const cont = require("../controllers/user");

router.post('/subscribe', cont.webpush.webPush);
router.get('/push', cont.webpush.webPush1);

module.exports = router;