const express = require("express");
const router = express.Router();
const cont = require("../controllers");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

router.patch("/updateProfile", middle(roles.user), cont.user.updateProfile);
router.get("/myProfile", middle(roles.user), cont.user.myProfile);

router.get("/data", middle(roles.admin), cont.user.getAllUser);
router.get("/data/:userId", middle(roles.admin), cont.user.getDetailUser);
router.delete("/data/:userId", middle(roles.admin), cont.user.delete);

module.exports = router;
