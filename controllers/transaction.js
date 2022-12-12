const { exclude } = require("query-string");
const {
  Transaction,
  DetailTransaction,
  User,
  Flight,
  Passenger,
} = require("../models");
module.exports = {
  createTransaction: async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { user_id, isPaid, roundTrip, oneWay, flight_id, passenger_id } =
          req.body;

        const transaction = await Transaction.create({
          user_id,
          isPaid,
          roundTrip,
          oneWay,
        });

        const detailTransaction = await DetailTransaction.create({
          transaction_id: transaction.id,
          flight_id,
          passenger_id,
        });

        const result = {
          success: true,
          message: "Transaction created successfully",
          data: {
            transaction: {
              ...transaction.dataValues,
              detailTransaction,
            },
          },
        };
        resolve(res.json(result));
      } catch (error) {
        next(error);
      }
    });
  },
  show: async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Transaction.findAll({
          include: [
            {
              model: User,
              as: "user_transaction",
              attributes: ['username', 'email']

            },
            {
              model: DetailTransaction,
              attributes: ['transaction_id'],
              as: "detail_transaction",
              include: [
                { 
                  model: Flight, 
                  attributes: {
                    exclude: ["id", "createdAt", "updatedAt"]
                  },
                  as: "flight" 
                },
                { 
                  model: Passenger, 
                  attributes: {
                    exclude: ["id", "createdAt", "updatedAt"]
                  },
                  as: "passenger" 
                },
              ],
            },
            
          ],
          attributes: {
            exclude : ["id", "user_id", "createdAt", "updatedAt", "detail_transaction"]
          }
        });
        const result = {
          success: true,
          message: "Transaction data retrieved successfully",
          data,
        };
        resolve(res.json(result));
      } catch (error) {
        next(error);
      }
    });
  },
  getTransactionById: async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      const { id } = req.params;
      try {
        const exist = await Transaction.findOne({
          where: { id },
          include: [
            {
              model: DetailTransaction,
              as: "detail_transaction",
              include: [
                {
                  model: Flight,
                  as: "flight",
                },
                {
                  model: Passenger,
                  as: "passenger",
                },
              ],
            },
            {
              model: User,
              as: "user_transaction",
            },
          ],
        });

        if (!exist) {
          return resolve(res.status(400).json({
            status: false,
            message: "Transaction not found"
          }));
        }

        resolve(res.status(200).json({
          status: true,
          message: "Transaction retrived successfully",
          data: exist
        }))
      } catch (error) {
        next(error);
      }
    });
  },
  update: async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      const { id } = req.params;
      const { user_id, isPaid, roundTrip, oneWay } = req.body;
      try {
        const exist = await Transaction.findOne({ where: { id } });
        console.log(exist);
        if (!exist) {
          return resolve(
            res.status(400).json({
              status: false,
              message: "Transaction not found",
            })
          );
        }

        const data = await Transaction.update(
          {
            user_id,
            isPaid,
            roundTrip,
            oneWay,
          },
          { where: { id }, returning: true }
        );

        const result = {
          status: false,
          message: "Transaction updated successfully",
          data: data[1][0],
        };
        resolve(res.status(200).json(result));
      } catch (error) {
        next(error);
      }
    });
  },
  delete: async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      const { id } = req.params;
      try {
        const exist = await Transaction.findOne({ where: { id } });

        if (!exist) {
          return resolve(res.status(400).json({
            status: false,
            message: "Transaction not found"
          }));
        }

        const data = await Transaction.destroy({ where: { id } });
        await DetailTransaction.destroy({ where: { transaction_id: id } })

        resolve(res.status(200).json({
          status: true,
          message: "Transaction deleted successfully"
        }));

      } catch (error) {
        next(error);
      }
    });
  },
};
