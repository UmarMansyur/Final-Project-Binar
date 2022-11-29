const express = require("express");
const router = express.Router();
const cont = require("../controllers");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

//register user
router.post("/register", cont.user.register);
//login user
router.post("/login", cont.user.login);
//forgot-password user
router.post("/forgot-password", cont.user.forgotPassword);

router.patch("/change-password", cont.user.changePassword);
router.get("/login/google", cont.user.loginGoogle);
router.get("/login/facebook", cont.user.loginFacebook);
router.get("/auth", middle(roles.user), cont.user.auth);

router.post("/subscribe", cont.webpush.webPush);

router.get("/reg", cont.webpush.webPush1);

router.get("/verif", cont.user.verifyEmail);

router.post("/updateProfile", middle(roles.user), cont.user.updateProfile);

router.get("/myProfile", middle(roles.user), cont.user.myProfile);

module.exports = router;
