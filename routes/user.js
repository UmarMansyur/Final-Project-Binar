const express = require("express");
const router = express.Router();
const cont = require("../controllers");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

router.post("/register", cont.user.register);
router.post("/login", cont.user.login);
router.get("/login/google", cont.user.loginGoogle);
router.get("/login/facebook", cont.user.loginFacebook);
router.post("/forgot-password", cont.user.forgotPassword);
router.patch("/reset-password", cont.user.resetPassword);
router.get("/auth", middle(roles.user), cont.user.auth);
router.post("/subscribe", cont.webpush.webPush);
router.patch("/changePassword", middle(roles.user), cont.user.changePassword);
router.get("/verif", cont.user.verifyEmail);
router.patch("/updateProfile", middle(roles.user), cont.user.updateProfile);
router.get("/myProfile", middle(roles.user), cont.user.myProfile);

router.get("/myProfile", middle(roles.user), cont.user.myProfile);

module.exports = router;
