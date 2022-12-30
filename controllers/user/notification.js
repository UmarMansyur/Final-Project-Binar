const { Notification } = require("../../models");
const { Op } = require("sequelize");

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
        message: "read notif by id success",
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
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const notification = await Notification.findOne({
        where: {
          id: id,
        },
      });

      if (!notification) {
        return res.status(400).json({
          status: false,
          detail_message: "notification not found",
          data: null,
        });
      }

      const deleted = await Notification.destroy({
        where: {
          id: id,
        },
      });

      return res.status(201).json({
        status: true,
        detail_message: "delete notification by id success",
      });
    } catch (err) {
      next(err);
    }
  },

  deleteAllReadNotification: async (req, res, next) => {
    try {
      const user_id = req.user.id;

      const notifications = await Notification.findAll({
        where: {
          user_id,
          is_read: {
            [Op.is]: true,
          },
        },
      });

      await notifications.forEach(async (notification) => {
        await notification.destroy();
      });

      return res.status(200).json({
        status: true,
        message: "success delete all notif read by user ",
      });
    } catch (err) {
      next(err);
    }
  },
};
