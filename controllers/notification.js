const { Notification } = require("../models");

module.exports = {
  create: async (req, res, next) => {
    try {
      const { user_id, title, detail_message } = req.body;

      const notification = await Notification.create({
        user_id: user_id,
        title: title,
        detail_message: detail_message,
      });

      return res.status(201).json({
        status: true,
        message: "Success create notification",
        data: notification,
      });
    } catch (err) {
      next(err);
    }
  },

  read: async (req, res, next) => {
    try {
      const { notificationId } = req.params;

      const notification = await Notification.findOne({
        where: {
          id: notificationId,
        },
      });

      if (!notification) {
        return res.status(400).json({
          status: false,
          message: "notification not found",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Success get detail notification",
        data: notification,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { notificationId } = req.params;

      let { user_id, title, detail_message } = req.body;

      const notification = await Notification.findOne({
        where: {
          id: notificationId,
        },
      });

      if (!notification) {
        return res.status(400).json({
          status: false,
          message: "notification not found",
          data: null,
        });
      }

      const updated = await notification.update(
        {
          user_id,
          title,
          detail_message,
        },
        {
          where: {
            id: notificationId,
          },
        }
      );

      return res.status(200).json({
        status: true,
        detail_message: "update notification success",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { notificationId } = req.params;

      const notification = await Notification.findOne({
        where: {
          id: notificationId,
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
          id: notificationId,
        },
      });

      return res.status(201).json({
        status: true,
        detail_message: "delete notification success",
        data: deleted,
      });
    } catch (err) {
      next(err);
    }
  },
};
