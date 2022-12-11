const router = require('express').Router();
const cont = require('../controllers');

router.post('/', cont.transaction.createTransaction);
router.get('/', cont.transaction.show);
router.get('/:id', cont.transaction.getTransactionById);
router.put('/:id', cont.transaction.update);
router.delete('/:id', cont.transaction.delete);

module.exports = router;