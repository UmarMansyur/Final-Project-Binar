const express = require("express");
const router = express.Router();
const cont = require("../controllers/admin");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

//authorized by admin
router.get("/data", middle(roles.admin), cont.admin.getAllUser);
router.get("/data/:userId", middle(roles.admin), cont.admin.getDetailUser);
router.delete("/data/:userId", middle(roles.admin), cont.admin.delete);

module.exports = router;