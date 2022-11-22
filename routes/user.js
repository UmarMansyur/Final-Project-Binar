const express = require('express');
const router = express.Router();
const cont = require('../controllers');
const middle = require('../middlewares/authorize');

// router.get('/register', cont.user.register);
router.post('/register', cont.user.register);

// router.get('/login', cont.auth.signIn);
router.post('/login', cont.user.login);



module.exports = router;