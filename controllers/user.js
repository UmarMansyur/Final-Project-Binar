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
};
