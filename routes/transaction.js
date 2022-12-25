const router = require("express").Router();
const cont = require("../controllers/user");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

router.post("/", middle(roles.user), cont.transaction.createTransaction);

///get history user transaction
router.get(
  "/",
  middle(roles.user),
  cont.transaction.getHistoryTransactionByUserId
);

// router.get("/", middle(roles.user), cont.transaction.show);

router.put("/:id", middle(roles.user), cont.transaction.update);
router.delete("/:id", middle(roles.user), cont.transaction.delete);
router.get('/generate', cont.transaction.pdf)

module.exports = router;
