const { Op } = require("sequelize");
const { Flight } = require("../models");
var moment = require("moment");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { GOFLIGHTLABS_ACCESS_KEY } = process.env;

module.exports = {};
