const user = require("./user");
const auth = require("./auth");
const webpush = require("./webpush");
const airport = require("./airport");
const passenger = require("./passenger");
const flight = require("./flight");
const notification = require("./notification");
const transaction = require("./transaction");
const scheduleFlight = require("./scheduleFlight");
module.exports = {
  user,
  auth,
  webpush,
  airport,
  passenger,
  flight,
  notification,
  transaction,
  scheduleFlight,
};
