const { where } = require("sequelize");
const {
  Transaction,
  DetailTransaction,
  User,
  Flight,
  Passenger,
} = require("../../models");

module.exports = {
  //get user tiket
  getTransactionByCode: async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      const { payment_code } = req.params;
      try {
        const exist = await Transaction.findOne({
          where: { payment_code },
          include: [
            {
              model: DetailTransaction,
              as: "detail_transaction",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              include: [
                {
                  model: Flight,
                  as: "flight",
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
                {
                  model: Passenger,
                  as: "passenger",
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
              ],
            },
            {
              model: User,
              as: "user_transaction",
              attributes: {
                exclude: [
                  "id",
                  "createdAt",
                  "updatedAt",
                  "password",
                  "thumbnail",
                ],
              },
            },
          ],
          attributes: {
            exclude: [
              "id",
              "user_id",
              "createdAt",
              "updatedAt",
              "detail_transaction",
            ],
          },
        });

        if (!exist) {
          return resolve(
            res.status(400).json({
              status: false,
              message: "Transaction not found",
            })
          );
        }

        resolve(
          res.status(200).json({
            status: true,
            message: "Sucess Get Detail My Order",
            data: exist,
          })
        );
      } catch (error) {
        next(error);
      }
    });
  },

  //get history transaksi user
  getHistoryTransactionByUserId: async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      try {
        const exist = await Transaction.findAll({
          where: { user_id: req.user.id },
          include: [
            {
              model: DetailTransaction,
              as: "detail_transaction",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              include: [
                {
                  model: Flight,
                  as: "flight",
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
                {
                  model: Passenger,
                  as: "passenger",
                  attributes: {
                    exclude: ["createdAt", "updatedAt"],
                  },
                },
              ],
            },
            // {
            //   model: User,
            //   as: "user_transaction",
            //   attributes: {
            //     exclude: [
            //       "id",
            //       "createdAt",
            //       "updatedAt",
            //       "password",
            //       "thumbnail",
            //     ],
            //   },
            // },
          ],
          attributes: {
            exclude: [
              "id",
              "user_id",
              "createdAt",
              "updatedAt",
              "detail_transaction",
            ],
          },
        });

        if (!exist) {
          return resolve(
            res.status(400).json({
              status: false,
              message: "Transaction not found",
            })
          );
        }

        resolve(
          res.status(200).json({
            status: true,
            message: "Success get all transaction",
            data: exist,
          })
        );
      } catch (error) {
        next(error);
      }
    });
  },

  payment: async (req, res, next) => {
    try {
      const { payment_code } = req.params;

      if (!payment_code) {
        return res.status(400).json({
          status: false,
          message: "payment code is required",
        });
      }

      const transaction = await Transaction.findOne({
        where: {
          payment_code,
        },
      });

      const detail_transaction = await DetailTransaction.findOne({
        where: {
          transaction_id: transaction.id,
        },
      });

      await Transaction.update(
        {
          isPaid: true,
        },
        {
          where: {
            payment_code,
          },
        }
      );

      const capacities = await Flight.findByPk(detail_transaction.flight_id);

      await Flight.update(
        {
          capacity: capacities.capacity - transaction.total,
        },
        {
          where: {
            id: detail_transaction.flight_id,
          },
          returning: true,
        }
      );

      const exist = await Transaction.findOne({
        where: { payment_code },
        include: [
          {
            model: DetailTransaction,
            as: "detail_transaction",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: Flight,
                as: "flight",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
              {
                model: Passenger,
                as: "passenger",
                attributes: {
                  exclude: ["createdAt", "updatedAt"],
                },
              },
            ],
          },
          {
            model: User,
            as: "user_transaction",
            attributes: {
              exclude: [
                "id",
                "createdAt",
                "updatedAt",
                "password",
                "thumbnail",
              ],
            },
          },
        ],
        attributes: {
          exclude: [
            "id",
            "user_id",
            "createdAt",
            "updatedAt",
            "detail_transaction",
          ],
        },
      });

      return res.status(200).json({
        status: true,
        message: "Success payment",
        data: exist,
      });
    } catch (error) {
      next(error);
    }
  },
};
