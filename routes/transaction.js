const router = require('express').Router();
const cont = require('../controllers/user');
const middle = require("../middlewares/authorize");
const roles = require('../utils/roles');

// router.post('/', middle(roles.user) ,cont.transaction.createTransaction);
router.post('/' ,middle(roles.user), cont.transaction.createTransaction);
router.get('/', cont.transaction.show);
router.get('/:id', cont.transaction.getTransactionById);
router.put('/:id', cont.transaction.update);
router.delete('/:id', cont.transaction.delete);

module.exports = router;