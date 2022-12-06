const { User, DetailUser } = require("../models");

module.exports = {
  updateProfile: async (req, res, next) => {
    try {
      const {
        user_id,
        first_name,
        last_name,
        fullName,
        gender,
        country,
        province,
        city,
        address,
        phone,
      } = req.body;

      const id = req.user.id;
      const exist = await DetailUser.findOne({ where: { user_id: id } });
      if (!exist)
        return res
          .status(400)
          .json({ status: false, message: "user not found!" });

      const detail_user = await DetailUser.update(
        {
          fullName: [first_name, last_name].join(" "),
          gender,
          country,
          province,
          city,
          address,
          phone,
        },
        {
          where: {
            user_id: id,
          },
        }
      );

      return res.status(200).json({
        status: true,
        message: "Profile updated successfully",
      });
    } catch (err) {
      next(err);
    }
  },

  myProfile: async (req, res, next) => {
    try {
      const id = req.user.id;
      const user = await User.findOne({ where: { id } });
      const detail = await DetailUser.findOne({ where: { user_id: id } });

      if (!user || !detail)
        return res
          .status(400)
          .json({ status: false, message: "user not found!" });

      return res.status(200).json({
        status: true,
        message: "berhasil dapat data!",
        data: {
          user,
          detail,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  //only admin
  getAllUser: async (req, res, next) => {
    try {
      const user = await User.findAll({
        attributes: { exclude: ["password", "thumbnail"] },
      });

      return res.status(200).json({
        status: true,
        message: "Sucess get data!",
        data: {
          user,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  getDetailUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await User.findOne({
        where: { id: userId },
        attributes: { exclude: ["password", "thumbnail"] },
      });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
          data: null,
        });
      }
      return res.status(200).json({
        status: true,
        message: "Get detail user success",
        data: user,
      });
    } catch (err) {
      next(err);
    }
  },

  //only admin
  delete: async (req, res, next) => {
    try {
      const { userId } = req.params;

      const userData = await User.findOne({ where: { id: userId } });

      if (!userData) {
        return res.status(400).json({
          status: false,
          message: "user not found",
          data: null,
        });
      }

      const isDeleted = await User.destroy({
        where: { id: userId },
      });

      return res.status(201).json({
        status: true,
        message: "delete user success",
      });
    } catch (err) {
      next(err);
    }
  },
};
