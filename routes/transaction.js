const router = require("express").Router();
const cont = require("../controllers/user");
const middle = require("../middlewares/authorize");
const roles = require("../utils/roles");

router.post("/", middle(roles.user), cont.transaction.createTransaction);
router.get("/", middle(roles.user), cont.transaction.show);
router.get(
  "/ticket/:payment_code",
  middle(roles.user),
  cont.transaction.getTransactionById
);
router.put("/:id", middle(roles.user), cont.transaction.update);
router.delete("/:id", middle(roles.user), cont.transaction.delete);

module.exports = router;
