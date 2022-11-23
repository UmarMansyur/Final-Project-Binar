const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, DetailUser } = require("../models");
const roles = require("../utils/roles");
const email1 = require('./email')
const ejs = require('ejs')

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try{
        const { username, email, password, thumbnail, role = roles.user, first_name, last_name, user_id, gender, country,
        province, city, address, phone } = req.body;

        const exist1 = await User.findOne({ where: { username }});
        if (exist1) return res.status(400).json({ status: false, message: `username ${username} already in use!!!`});

        const exist = await User.findOne({ where: { email }});
        if (exist) return res.status(400).json({ status: false, message: 'e-mail already in use!!!'});

        const passHash = await bcrypt.hash(password, 10);

        const regis = await User.create({
            username,
            email,
            password: passHash,
            thumbnail,
            role
        })

        const regis1 = await DetailUser.create({
            user_id: regis.id,
            fullname: [first_name, last_name].join(' '),
            gender,
            country,
            province,
            city,
            address,
            phone
            
        })

        const html = await email1.getHtml('helo.ejs', { user: { name: regis1.fullname }})

        const response = await email1.sendEmail(`${regis.email}`, 'Welcome, new user', `${html}`)

        return res.status(200).json({
            status: true,
            message: 'account successfully registered',
            data: {
                regis,
                regis1,
                response
                
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

  auth : (req, res, next) => {
    const user = req.user;

    return res.status(200).json({
        status: true,
        message: 'successful authentication',
        data: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

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
