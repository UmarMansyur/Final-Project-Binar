const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const roles = require("../utils/roles");

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: {},
  login: async (req, res, next) => {
    try {
      const user = await User.authenticate(req.body);

      const accesstoken = user.generateToken();

      return res.status(200).json({
        status: true,
        message: "success",
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          token: accesstoken,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  loginGoogle: {},

  loginFacebook: {},

  changePassword: {},

  forgotPasswordPage: {},

  forgotPassword: {},

  resetPasswordPage: {},

  resetPassword: {},
};
