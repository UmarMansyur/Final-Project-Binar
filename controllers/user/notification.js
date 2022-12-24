const { Notification } = require("../../models");

module.exports = {
  getNotifications: async (req, res, next) => {
    try {
      const id = req.user.id;

      const exist = await Notification.findAll({ where: { user_id: id } });

      await Notification.update(
        {
          is_read: true,
        },
        {
          where: {
            user_id: id,
          },
        }
      );
      if (!exist) {
        return res.status(400).json({
          status: null,
          message: "No Notif",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Success Get Notifications",
        data: exist,
      });
    } catch (error) {
      next(err);
    }
  },
};
