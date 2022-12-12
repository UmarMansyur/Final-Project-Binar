const express = require("express");
const router = express.Router();
const cont = require("../controllers/admin");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

// get all notif created by admin
router.get("/", middle([roles.admin]), cont.notification.index);

// get detail notif
router.get("/:id", middle([roles.admin]), cont.notification.read);

// create notif by admin
router.post("/", middle([roles.admin]), cont.notification.create);

// update notif
router.put("/:notificationId", middle([roles.admin]), cont.notification.update);

// delete notif
router.delete(
  "/:notificationId",
  middle([roles.admin]),
  cont.notification.delete
);

module.exports = router;
