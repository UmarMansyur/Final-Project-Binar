const googleOauth2 = require("../../utils/oauth2/google");
const facebookOauth2 = require("../../utils/oauth2/facebook");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { User, DetailUser, Notification } = require("../../models");
const roles = require("../../utils/roles");
const userTypes = require("../../utils/userType");
const email1 = require("../../utils/sendEmail");
const webpush = require("web-push");
const validator = require("validator");
const { JWT_SECRET_KEY, API_HOST, FE_HOST } = process.env;

const subscriptions = require("../../subscriptions.json");
//tes
module.exports = {
  register: async (req, res, next) => {
    try {
      const {
        username,
        email,
        password,
        confirmPassword,
        thumbnail,
        role = roles.user,
        user_type = userTypes.basic,
        is_verified = 0,
      } = req.body;

      const exist = await User.findOne({ where: { email } });
      if (exist)
        return res.status(400).json({
          status: false,
          message: "e-mail already in use!!!",
        });

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          status: false,
          message: "Email is not valid",
        });
      }

      let strongPassword = new RegExp(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
      );
      let check = strongPassword.test(password);
      if (!check)
        return res.status(400).json({
          status: false,
          message:
            "Password min 6 character, include a minimum of 1 lower case letter [a-z], a minimum of 1 upper case letter [A-Z] , and a minimum of 1 numeric character [0-9]",
        });

      if (password != confirmPassword)
        return res.status(400).json({
          status: false,
          message: "password and confirm password doesn\t match!!!",
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

      await DetailUser.create({
        user_id: user.id,
      });

      await Notification.create({
        user_id: user.id,
        title: "Welcome!",
        detail_message:
          "Welcome to Terbang Tinggi App!, Book Your Flight Now!, Cheap,Fast,and Easy",
        is_read: false,
      });

      const apiHost = API_HOST;
      const payload1 = { id: user.id };
      const token = jwt.sign(payload1, JWT_SECRET_KEY);
      const link = `${apiHost}/auth/verif?token=${token}`;

      const html = await email1.getHtml("email/helo.ejs", {
        user: {
          name: user.username,
          link: link,
        },
      });

      const response = await email1.sendEmail(
        `${user.email}`,
        "Verify Your Email Address",
        `${html}`
      );

      const payload = JSON.stringify({
        title: `${user.username}, Congratulations, your account has been successfully created`,
        body: "Please check email for notification",
        url: "https://mail.google.com",
      });

      subscriptions.forEach((subscription) => {
        webpush
          .sendNotification(subscription, payload)
          .then((result) => result)
          .catch((e) => e.stack);
      });

      return res.status(201).json({
        status: true,
        message:
          "account successfully registered, check your email to verif your account",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          user_type: user.user_type,
        },
      });
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
          username: user.username,
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
        user_type: user.user_type,
      },
    });
  },

  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token)
        return res.status(400).json({
          status: false,
          message: "invalid token",
          token,
        });

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

      const payload1 = JSON.stringify({
        title: `Terbang Tinggi App`,
        body: "Congratulations, your account has been verified",
        url: "https://terbangtinggi-staging.km3ggwp.com/login",
      });

      subscriptions.forEach((subscription) => {
        webpush
          .sendNotification(subscription, payload1)
          .then((result) => result)
          .catch((e) => e.stack);
      });

      return res.redirect(`${FE_HOST}/verified-email/`);
    } catch (err) {
      next(err);
    }
  },

  loginGoogle: async (req, res, next) => {
    try {
      const { access_token } = req.body;
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
      );

      const { name, email, picture } = response.data;

      let user = await User.findOne({ where: { email: email } });

      if (!user) {
        await User.create({
          username: name,
          email,
          thumbnail: picture,
          role: roles.user,
          user_type: userTypes.google,
          is_verified: 1,
        });
      }

      let newUser = await User.findOne({ where: { email: email } });

      let detailUser = await DetailUser.findOne({
        where: { user_id: newUser.id },
      });

      if (!detailUser) {
        await DetailUser.create({
          user_id: newUser.id,
        });
      }

      // delete user.encryptedPassword;

      // generate token
      const payload = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        user_type: newUser.user_type,
        role: newUser.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

      res.status(201).json({
        status: true,
        message: "Success get token",
        token,
      });
    } catch (err) {
      console.log(err);
    }
  },

  //get credential token
  loginGoogleGetData: async (req, res, next) => {
    try {
      const code = req.query.code;
      if (!code) {
        const url = googleOauth2.generateAuthURL();

        return res.redirect(url);
      }

      const token = await googleOauth2.setCredentials(code);

      const { data } = await googleOauth2.getUserData();

      return res.status(200).json({
        data,
        token,
      });
    } catch (err) {
      console.log(err);
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

      res.send(userInfo);
    } catch (err) {
      next(err);
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { newPassword, confirmPassword } = req.body;
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          status: false,
          message: "invalid token!",
        });
      }
      if (newPassword != confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "password and confirm password doesn't match",
        });
      }

      const payload = jwt.verify(token, JWT_SECRET_KEY);

      const encryptedPassword = await bcrypt.hash(newPassword, 10);

      const user = await User.update(
        { password: encryptedPassword },
        { where: { id: payload.id } }
      );

      if (user) {
        return res.status(200).json({
          status: true,
          message: "password updated successfully",
        });
      }
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "email not found",
        });
      } else {
        const apiHost = API_HOST;
        const payload = { id: user.id };
        const token = jwt.sign(payload, JWT_SECRET_KEY);
        const link = `${FE_HOST}/reset-password?token=${token}`;
        htmlEmail = await email1.getHtml("email/reset-password.ejs", {
          name: user.name,
          link: link,
        });
        await email1.sendEmail(user.email, "Reset your password", htmlEmail);
      }
      return res.status(200).json({
        success: true,
        message: "Success send email forgot password to user",
      });
    } catch (err) {
      next(err);
    }
  },
};
