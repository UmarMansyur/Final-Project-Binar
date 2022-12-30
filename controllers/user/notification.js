const { Notification } = require("../../models");

module.exports = {
  getNotifications: async (req, res, next) => {
    try {
      const id = req.user.id;

      const exist = await Notification.findAll({ where: { user_id: id } });

      if (!exist) {
        return res.status(400).json({
          status: null,
          message: "Data not found",
        });
      }

      // await Notification.update(
      //   {
      //     is_read: true,
      //   },
      //   {
      //     where: {
      //       user_id: id,
      //     },
      //   }
      // );

      return res.status(200).json({
        status: true,
        message: "Success Get Notifications",
        data: exist,
      });
    } catch (error) {
      next(err);
    }
  },

  readNotification: async (req, res, next) => {
    try {
      const { id } = req.params;
      const notification = await Notification.update(
        {
          is_read: true,
        },
        {
          where: { id: id },
        }
      );
      return res.status(200).json({
        status: true,
        message: "read notif success",
        data: notification,
      });
    } catch (err) {
      next(err);
    }
  },
  readAllNotifications: async (req, res, next) => {
    try {
      const notification = await Notification.update(
        {
          is_read: true,
        },
        {
          where: { is_read: false },
        }
      );
      return res.status(200).json({
        status: true,
        message: "Read all notif success",
        data: notification,
      });
    } catch (err) {
      next(err);
    }
  },
};
