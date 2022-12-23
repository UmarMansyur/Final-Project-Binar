const auth = require("./auth");
const webpush = require("./webpush");
const airport = require("./airport");
const passenger = require("./passenger");
const scheduleFlight = require("./scheduleFlight");
const transaction = require("./transaction");
const user = require("./user");
const ticket = require("./ticket");
const userNotification = require("./notification");
module.exports = {
  user,
  auth,
  webpush,
  airport,
  passenger,
  transaction,
  scheduleFlight,
  ticket,
  userNotification,
};
