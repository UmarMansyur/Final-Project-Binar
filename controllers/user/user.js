const { User, DetailUser } = require("../../models");

module.exports = {
  updateProfile: async (req, res, next) => {
    try {
      const {
        first_name,
        last_name,
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

      const updatedProfile = await DetailUser.findOne({
        where: { user_id: id },
        attributes: {
          exclude: ["id", "user_id", "createdAt", "updatedAt"],
        },
      });

      return res.status(200).json({
        status: true,
        message: "Profile updated successfully",
        data: updatedProfile,
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

      if (!user)
        return res
          .status(400)
          .json({ status: false, message: "user not found!" });

      return res.status(200).json({
        status: true,
        message: "berhasil dapat data!",
        data: {
          username: user.username,
          email: user.email,
          thumbnail: user.thumbnail,
          fullName: detail.fullName,
          gender: detail.gender,
          country: detail.country,
          province: detail.province,
          city: detail.city,
          address: detail.address,
          phone: detail.phone,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
