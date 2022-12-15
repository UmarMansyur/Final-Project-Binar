const { User, Passenger, DetailTransaction, Flight } = require("../../models");
const multer = require("multer");
const upload = multer();
const imagekit = require("../../utils/imagekit");

module.exports = {
  show: async (req, res, next) => {
    try {
      // passenger_id doesn't colomn exist
      const ticket = await Passenger.findAll({
        where: { id: req.user.id },
        // where: { id: 1 },
        attributes: {
          exclude: ["id", "passenger_id", "createdAt", "updatedAt"],
        },
        include: [
          {
            model: DetailTransaction,
            as: "passenger",
            include: {
              model: Flight,
              as: "flight",
            },
          },
        ],
      });
      if (!ticket) {
        return res.status(404).json({
          status: false,
          message: "ticket not found",
          data: null,
        });
      }
      return res.status(200).json({
        status: true,
        message: "get ticket success",
        data: ticket,
      });
    } catch (err) {
      next(err);
    }
  },

  passenger: async (req, res, next) => {
    try {
      
      const user = req.user;
      const {
        detail_transaction_id,
        email,
        firstName,
        lastName,
        phone,
        type,
        travelDocument,
      } = req.body;

      const usercompare = await User.findOne({
        where: {
          id: user.id,
        },
      });
      if (!usercompare)
        return res.status(400).json({
          status: false,
          message: "user not found!",
        });
      let uploadedFile1 = null;
      if (req.file != undefined) {
        const file = req.file.buffer.toString("base64");

        const uploadedFile = await imagekit.upload({
          file,
          fileName: req.file.originalname,
        });

        const image = uploadedFile.url;

        uploadedFile1 = await Passenger.create({
          passenger_id: usercompare.id,
          detail_transaction_id: detail_transaction_id,
          email,
          firstName,
          lastName,
          phone,
          type,
          travelDocument: image,
        });
      } else {
        uploadedFile1 = await Passenger.create({
          passenger_id: usercompare.id,
          detail_transaction_id: detail_transaction_id,
          email,
          firstName,
          lastName,
          phone,
          type,
          travelDocument: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "success upload document",
        data: uploadedFile1,
      });
    } catch (err) {
      next(err);
    }
  },
};
