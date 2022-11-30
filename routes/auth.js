const express = require("express");
const router = express.Router();
const cont = require("../controllers");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

router.post("/register", cont.auth.register);
router.post("/login", cont.auth.login);
router.get("/login/google", cont.auth.loginGoogle);
router.get("/login/facebook", cont.auth.loginFacebook);
router.post("/forgot-password", cont.auth.forgotPassword);
router.patch("/reset-password", cont.auth.resetPassword);
router.get("/auth", middle(roles.user), cont.auth.auth);
router.post("/subscribe", cont.webpush.webPush);
router.get("/verif", cont.auth.verifyEmail);

module.exports = router;
