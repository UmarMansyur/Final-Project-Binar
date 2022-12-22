const { Flight } = require("../../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");
const moment = require("moment");
module.exports = {
  showFilter: async (req, res, next) => {
    try {
      const { departure, arrival, date, sc, tripType, passengers, returnDate } =
        req.query;

      const attributes = ["updateAt", "createdAt"];
      let data = "";
      if (tripType == "one_way") {
        attributes.push("returnDate");
        data = await Flight.findAll({
          attributes: {
            exclude: attributes,
          },
          where: {
            departure,
            arrival,
            sc,
            tripType,
            date: {
              [Op.eq]: date,
            },
            capacity: {
              [Op.gte]: passengers,
            },
          },
        });
      } else {
        data = await Flight.findAll({
          attributes: {
            exclude: attributes,
          },
          where: {
            departure,
            arrival,
            sc,
            tripType,
            date: {
              [Op.eq]: date,
            },
            returnDate: {
              [Op.eq]: returnDate,
            },
            capacity: {
              [Op.gte]: passengers,
            },
          },
        });
      }

      if (data.length < 1)
        return res.status(400).json({
          status: false,
          message: `flight schedule not found`,
        });

      return res.status(200).json({
        status: true,
        message: "Success Get Data",
        data: data,
      });
    } catch (error) {
      next(error);
    }
  },
};
