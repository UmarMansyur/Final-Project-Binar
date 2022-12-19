const router = require("express").Router();
const cont = require("../controllers/user");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

///get history user transaction
router.get("/", middle(roles.user), cont.ticket.getHistoryTransactionByUserId);

// router.get("/", middle(roles.user), cont.transaction.show);

//get ticket by payment code
router.get(
  "/:payment_code",
  middle(roles.user),
  cont.ticket.getTransactionByCode
);

module.exports = router;
