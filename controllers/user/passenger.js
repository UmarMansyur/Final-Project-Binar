const {
  User,
  Passenger,
  DetailTransaction,
  Flight,
  Transaction,
  sequelize,
} = require("../../models");
const multer = require("multer");
const upload = multer();
const imagekit = require("../../utils/imagekit");

module.exports = {
  show: async (req, res, next) => {
    try {
      // passenger_id doesn't colomn exist
      // const ticket = await Transaction.findAll({
      //   where: { user_id: req.user.id },
      //   include: [
      //     {
      //       model: DetailTransaction,
      //       as: "detail_transaction",
      //       include: [
      //         {
      //           model: Flight,
      //           as: "flight",
      //         },
      //         {
      //           model: Passenger,
      //           as: "passenger",
      //         },
      //       ],
      //     },

      //   ]
      // });
      const ticket = await sequelize.query(
        `SELECT * FROM "Passengers" JOIN "DetailTransactions" ON "Passengers".detail_transaction_id = "DetailTransactions".id JOIN "Transactions" ON "DetailTransactions".id = "Transactions".id JOIN "Flights" ON "DetailTransactions".flight_id = "Flights".id WHERE "Transactions".user_id = ${req.user.id}`,
        { type: sequelize.QueryTypes.SELECT }
      );
      // const ticket = await Passenger.findAll({
      //   // where: { id: 1 },
      //   attributes: {
      //     exclude: ["id", "passenger_id", "createdAt", "updatedAt"],
      //   },
      //   include: [
      //     {
      //       model: DetailTransaction,
      //       as: "passenger",
      //       include: [
      //         {
      //           model: Flight,
      //           as: "flight",
      //         },
      //         {
      //           model: Transaction,
      //           as: "transaction",
      //           where: {
      //             user_id: req.user.id
      //           }
      //         },
      //       ],
      //     },
      //   ],
      // });
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
      // console.log(err);
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

  getAllDocument: async (req, res, next) => {
    try {
      const { payment_code } = req.params;
      const trans = await Transaction.findAll({ where: { payment_code: payment_code }})
      const doc = await DetailTransaction.findAll({ where: { transaction_id: trans.id}})
      const usercompare = await Passenger.findAll({
        where: {
          detail_transaction_id: doc.id,
        },
      });
    }catch (err){
      next(error)
    }
  },

  uploadDocument: async (req, res, next) => {
    try {
      const { id } = req.params;

      let uploadedFile1 = null;
      if (req.file != undefined) {
        const file = req.file.buffer.toString("base64");

        const uploadedFile = await imagekit.upload({
          file,
          fileName: req.file.originalname,
        });

        const image = uploadedFile.url;

        uploadedFile1 = await Passenger.update(
          {
            travelDocument: image,
          },
          {
            where: {
              id: id,
            },
          }
        );
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
