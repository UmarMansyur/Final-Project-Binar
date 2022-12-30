const express = require("express");
const router = express.Router();
const cont = require("../controllers/admin");
const userCont = require("../controllers/user");
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

router.patch(
  "/readall",
  middle([roles.admin, roles.user]),
  userCont.userNotification.readAllNotifications
);

router.patch(
  "/read/:id",
  middle([roles.admin, roles.user]),
  userCont.userNotification.readNotification
);

router.delete(
  "/readall",
  middle([roles.admin, roles.user]),
  userCont.userNotification.deleteAllReadNotification
);

// delete notif
router.delete(
  "/:notificationId",
  middle([roles.admin]),
  cont.notification.delete
);

// get all notif created user
router.get(
  "/user/data",
  middle([roles.user]),
  userCont.userNotification.getNotifications
);

module.exports = router;
