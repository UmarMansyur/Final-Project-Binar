const {
  Transaction,
  DetailTransaction,
  User,
  Flight,
  Passenger,
  Ticket
} = require("../../models");
const crypto = require("crypto");
const pdf = require('html-pdf')
const ejs = require('ejs')
const path = require('path')
const imagekit = require("../../utils/imagekit");
const fs = require('fs')
const qr = require('qr-image');

module.exports = {
  createTransaction: async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { isPaid = 0, flight_id, passenger } = req.body;
        const user = req.user;
        var payment_code = crypto.randomBytes(20).toString("hex");
        const countPassenger = passenger.length;
        const transaction = await Transaction.create({
          user_id: user.id,
          isPaid,
          payment_code,
          total: countPassenger,
        });

        const detailTransaction = await DetailTransaction.create({
          transaction_id: transaction.id,
          flight_id,
        });

        const passengers = await Passenger.bulkCreate(
          passenger.map((item) => ({
            ...item,
            detail_transaction_id: detailTransaction.id,
          }))
        );

        const result = {
          success: true,
          message: "Transaction created successfully",
          data: {
            transaction: {
              ...transaction.dataValues,
              detail_transaction: {
                ...detailTransaction.dataValues,
                passenger: passengers.map((item) => ({
                  ...item.dataValues,
                })),
              },
            },
          },
        };

        resolve(res.json(result));
      } catch (error) {
        // console.log(error);
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

  show: async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      try {
        const data = await Transaction.findAll({
          include: [
            {
              model: User,
              as: "user_transaction",
              attributes: ["username", "email"],
            },
            {
              model: DetailTransaction,
              attributes: ["transaction_id"],
              as: "detail_transaction",
              include: [
                {
                  model: Flight,
                  attributes: {
                    exclude: ["id", "createdAt", "updatedAt"],
                  },
                  as: "flight",
                },
                {
                  model: Passenger,
                  attributes: {
                    exclude: ["id", "createdAt", "updatedAt"],
                  },
                  as: "passenger",
                },
              ],
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

  update: async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
      const { id } = req.params;
      const { user_id, isPaid, roundTrip, oneWay } = req.body;
      try {
        const exist = await Transaction.findOne({ where: { id } });
        // console.log(exist);
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
          return resolve(
            res.status(400).json({
              status: false,
              message: "Transaction not found",
            })
          );
        }

        const data = await Transaction.destroy({ where: { id } });
        await DetailTransaction.destroy({ where: { transaction_id: id } });

        resolve(
          res.status(200).json({
            status: true,
            message: "Transaction deleted successfully",
          })
        );
      } catch (error) {
        next(error);
      }
    });
  },
  pdf: async (req, res, next) => {
    const { payment_code } = req.params;

    const trans = await Transaction.findOne({ where: { payment_code: payment_code } })
    if (!trans) return res.status(400).json({ status: false, message: 'payment code not found' })

    const detailtrans = await DetailTransaction.findOne({ where: { transaction_id: trans.id } })
    const flight = await Flight.findOne({ where: { id: detailtrans.flight_id } })
    const pass = await Passenger.findAll({ where: { detail_transaction_id: detailtrans.id } })
    try{
      ejs.renderFile(path.join(__dirname, '../../views/', "report-template.ejs"), {trans: trans, pass: pass, detailtrans: detailtrans, flight: flight}, (err, data) => {
        if (err) {
              res.send(err);
        } else {
            let options = {
                "height": "7.25in",
                "width": "8.5in",
                "header": {
                    "height": "20mm"
                },
                "footer": {
                    "height": "20mm",
                },
                 "phantomPath": "./node_modules/phantomjs-prebuilt/bin/phantomjs" 
            };
            pdf.create(data, options).toFile(`ticket-${payment_code}.pdf`, function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                  const file1 = fs.readFileSync(data.filename)
                  const file = file1.toString('base64')

                   imagekit.upload({
                      file,
                      fileName: `ticket-${payment_code}.pdf`
                  })
                  .then(function(result) {
                    const link = result.url;

                    const buffer = qr.imageSync(link)

                    const b = buffer.toString("base64");

                     Ticket.create({
                    detail_transaction_id: pass.detail_transaction_id,
                    ticket_pdf: link,
                    qr_code: b
                    })
                    return res.status(200).json({
                      status: true,
                      message: 'success',
                      url: link,
                      buffer: b
                    })
                  })
                }
              });
            }
          });
    }catch (err){
      next(err)
    }
  }
};
