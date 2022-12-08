const googleOauth2 = require("../utils/oauth2/google");
const facebookOauth2 = require("../utils/oauth2/facebook");
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { User, DetailUser } = require("../models");
const roles = require("../utils/roles");
const userTypes = require("../utils/userType");
const email1 = require("../utils/sendEmail");
const webpush = require("web-push");
const { JWT_SECRET_KEY, API_HOST } = process.env;

const subscriptions = require("../subscriptions.json");

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

      const exist1 = await User.findOne({ where: { username } });
      if (exist1)
        return res.status(400).json({
          status: false,
          message: `username ${username} already in use!!!`,
        });

      const exist = await User.findOne({ where: { email } });
      if (exist)
        return res.status(400).json({
          status: false,
          message: "e-mail already in use!!!",
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

      const apiHost = API_HOST;
      const payload1 = { id: user.id };
      const token = jwt.sign(payload1, JWT_SECRET_KEY);
      const link = `https://terbangtinggi-staging.km3ggwp.com/verified-email/?token=${token}`;

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
      });

      subscriptions.forEach((subscription) => {
        webpush
          .sendNotification(subscription, payload)
          .catch((e) => console.log(e.stack));
      });

      return res.status(201).json({
        status: true,
        message: "account successfully registered",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          user_type: user.user_type,
        },
      });
    } catch (err) {
      console.log(err);
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
      },
    });
  },

  verifyEmail: async (req, res, next) => {
    try {
      const { token } = req.query;
      if (!token)
        // return res.render("auth/verif", { message: "invalid token", token });
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

      // return res.render("auth/verif", { message: null });
      return res.status(200).json({
        status: true,
        message: "account verified successfully",
        verif,
      });
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
      if (!user)
        user = await User.create({
          username: name,
          email,
          thumbnail: picture,
          role: roles.basic,
          user_type: userTypes.google,
          is_verified: 1,
        });

      delete user.encryptedPassword;

      // generate token
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        user_type: user.user_type,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

      res.status(201).json({
        status: true,
        message: "Success get token",
        token,
      });
    } catch (err) {
      next(err);
    }
  },

  //get credential token
  loginGoogleGetData: async (req, res, next) => {
    try {
      const code = req.query.code;
      if (!code) {
        const url = googleOauth2.generateAuthURL();
        console.log(url);
        return res.redirect(url);
      }

      const token = await googleOauth2.setCredentials(code);

      const { data } = await googleOauth2.getUserData();

      return res.status(200).json({
        data,
        token,
      });
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
      console.log(userInfo.picture.data.url);
      res.send(userInfo);
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
          message: "password 1 dan password 2 doesn'\t match!",
        });

      const hashedPassword = await bcrypt.hash(passwordBaru, 10);
      await usercompare.update({ password: hashedPassword });

      return res.status(200).json({
        success: true,
        message: "The password has been successfully changed",
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: err.message,
      });
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
        const link = `https://terbangtinggi-staging.km3ggwp.com/reset-password?token=${token}`;
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
};
