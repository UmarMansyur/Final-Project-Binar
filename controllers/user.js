const googleOauth2 = require("../utils/oauth2/google");
const facebookOauth2 = require("../utils/oauth2/facebook");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, DetailUser } = require("../models");
const roles = require("../utils/roles");
const userTypes = require("../utils/userType");

const email1 = require("./email");
const ejs = require("ejs");
const webpush = require("web-push");

const { JWT_SECRET_KEY } = process.env;

const subscriptions = require("./subscriptions.json");

module.exports = {
  registerPage: (req, res) => {
    res.render("auth/register", { error: null });
  },

  register: async (req, res, next) => {
    try {
      const {
        username,
        email,
        password,
        thumbnail,
        role = roles.user,
        user_type = userTypes.basic,
        is_verified = 0,
        first_name,
        last_name,
        user_id,
        gender,
        country,
        province,
        city,
        address,
        phone,
      } = req.body;

      const exist1 = await User.findOne({ where: { username } });
      // if (exist1) return res.status(400).json({ status: false, message: `username ${username} already in use!!!`});

      if (exist1)
        return res.render("auth/register", {
          error: `username ${username} already in use!!!`,
        });

      const exist = await User.findOne({ where: { email } });
      // if (exist) return res.status(400).json({ status: false, message: 'e-mail already in use!!!'});

      if (exist)
        return res.render("auth/register", {
          error: "e-mail already in use!!!",
        });

      const passHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: passHash,
        thumbnail,
        role,
        user_type,
        is_verified,
      });

      const detail_user = await DetailUser.create({
        user_id: user.id,
        fullName: [first_name, last_name].join(" "),
        gender,
        country,
        province,
        city,
        address,
        phone,
      });

      const payload1 = { id: user.id };
      const token = jwt.sign(payload1, JWT_SECRET_KEY);
      const link = `http://localhost:3002/auth/verif?token=${token}`;

      const html = await email1.getHtml("helo.ejs", {
        user: {
          name: detail_user.fullName,
          link: link,
        },
      });

      const response = await email1.sendEmail(
        `${user.email}`,
        "Welcome, new user",
        `${html}`
      );

      const payload = JSON.stringify({
        title: `${detail_user.fullName}, Congratulations, your account has been successfully created`,
        body: "Please check email for notification",
      });

      // user_id : user.id
      // data: JSON.stringify(subscription);

      subscriptions.forEach((subscription) => {
        webpush
          .sendNotification(subscription, payload)
          .then((result) => console.log(result))
          .catch((e) => console.log(e.stack));
      });

      // return res.status(200).json({
      //     status: true,
      //     message: 'account successfully registered',
      //     data: {
      //         regis,
      //         regis1,
      //         response

      //     }
      // })

      return res.render("auth/login", { error: null });
    } catch (err) {
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

  auth: (req, res, next) => {
    const user = req.user;

    return res.status(200).json({
      status: true,
      message: "successful authentication",
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  },

  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token)
        return res.render("auth/verif", { message: "invalid token", token });

      const payload = jwt.verify(token, JWT_SECRET_KEY);

      const verif = await User.update(
        {
          is_verified: 1,
        },
        {
          where: {
            id: payload.id,
          },
        }
      );

      return res.render("auth/verif", { message: null });
    } catch (err) {
      next(err);
    }
  },

  loginGoogle: async (req, res, next) => {
    try {
      const code = req.query.code;
      if (!code) {
        const url = googleOauth2.generateAuthURL();
        return res.redirect(url);
      }

      await googleOauth2.setCredentials(code);
      const { data } = await googleOauth2.getUserData();

      let userExist = await User.findOne({ where: { email: data.email } });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  },

  loginFacebook: async (req, res, next) => {
    try {
      const code = req.query.code;
      if (!code) {
        const url = facebookOauth2.generateAuthURL();
        return res.redirect(url);
      }
      const access_token = await facebookOauth2.getAccessToken(code);
      const userInfo = await facebookOauth2.getUserInfo(access_token);
      console.log(userInfo.picture.data.url)
      res.send(userInfo)

     
    } catch (err) {
      next(err);
    }
  },

  changePassword: async (req, res, next) => {
    try {
      const { passwordLama, passwordBaru, passwordBaru2 } = req.body;

      const usercompare = await User.findOne({
        where: {
          id: req.user.id,
        },
      });
      if (!usercompare) {
        return res.status(400).json({
          status: false,
          message: "user not found!",
        });
      }

      const pass = await bcrypt.compare(passwordLama, usercompare.password);
      if (!pass) {
        return res.status(400).json({
          status: false,
          message: "incorrect password!!",
        });
      }

      if (passwordBaru !== passwordBaru2)
        return res.status(422).json({
          status: false,
          message: "password 1 and password 2 doesn't match!",
        });

      const hashedPassword = await bcrypt.hash(passwordBaru, 10);
      await usercompare.update({ password: hashedPassword });

      return res.status(200).json({
        success: true,
        message: "password changed successfully!",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  },

  forgotPasswordPage: async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },

  resetPasswordPage: async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
    } catch (err) {
      next(err);
    }
  },
};
