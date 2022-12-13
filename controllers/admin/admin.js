const { User, DetailUser } = require("../../models");

module.exports = {
      //only admin
  getAllUser: async (req, res, next) => {
    try {
      const { limit = 5, page = 1 } = req.query;
      const offset = (page - 1) * limit;
      const user = await User.findAll({
        limit: limit,
        offset: offset,
        include: [
          {
            model: DetailUser,
            as: "detail_user",
            attributes: { exclude: ["password", "thumbnail"] },
          }
        ]
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
        include: [
          {
            model: DetailUser,
            as: "detail_user",
          },
        ],
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
}