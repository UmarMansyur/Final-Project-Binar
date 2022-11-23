const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const roles = require("../utils/roles");

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try{
        const { username, email, password, role = roles.user } = req.body;

        const exist = await User.findOne({ where: { email }});
        if (exist) return res.status(400).json({ status: false, message: 'e-mail already in use!!!'});

        const passHash = await bcrypt.hash(password, 10);

        const regis = await User.create({
            username,
            email,
            password: passHash,
            role
        })

        return res.status(200).json({
            status: true,
            message: 'account successfully registered',
            data: {
                username: regis.username,
                email: regis.email,
                password: regis.password,
                role: regis.role
            }            
        })
    }catch (err){
        next(err);
    }
  },
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

  loginGoogle: async (req, res, next) => {
    try{

    }catch (err){
        next(err);
    }
  },

  loginFacebook: async (req, res, next) => {
    try{

    }catch (err){
        next(err);
    }
  },

  changePassword: async (req, res, next) => {
    try{

    }catch (err){
        next(err);
    }
  },

  forgotPasswordPage: async (req, res, next) => {
    try{

    }catch (err){
        next(err);
    }
  },

  forgotPassword: async (req, res, next) => {
    try{

    }catch (err){
        next(err);
    }
  },

  resetPasswordPage: async (req, res, next) => {
    try{

    }catch (err){
        next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try{

    }catch (err){
        next(err);
    }
  },
};
