const express = require("express");
const router = express.Router();
const cont = require("../controllers");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

// router.get('/register', cont.user.register);
router.get("/register", cont.user.registerPage);
router.post("/register", cont.user.register);

// router.get('/login', cont.auth.signIn);
router.post("/login", cont.user.login);

router.get("/auth", middle(roles.user), cont.user.auth);

router.post("/subscribe", cont.webpush.webPush);

router.get("/register", cont.webpush.webPush1);

router.patch("/changePassword", middle(roles.user), cont.user.changePassword);

router.get("/verif", cont.user.verifyEmail);

router.post("/forgot-password", cont.user.forgotPassword);

router.get("/reset-password", cont.user.resetPasswordPage);
router.post("/reset-password", cont.user.resetPassword);

module.exports = router;
