const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const roles = require("../utils/roles");

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: {},

  login: {},

  loginGoogle: {},

  loginFacebook: {},

  changePassword: {},

  forgotPasswordPage: {},

  forgotPassword: {},

  resetPasswordPage: {},

  resetPassword: {},
};
