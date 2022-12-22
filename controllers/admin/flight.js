const { Op } = require("sequelize");
const { Flight } = require("../../models");
const sequelize = require("sequelize");
const flight = require("../../models/flight");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        code,
        airlineName,
        departureAirport,
        departure,
        arrivalAirport,
        arrival,
        date,
        returnDate,
        capacity,
        tripType,
        sc,
        departureTime,
        arrivalTime,
        price,
      } = req.body;

      if (
        !airlineName ||
        !code ||
        !departureAirport ||
        !departure ||
        !arrivalAirport ||
        !arrival ||
        !date ||
        !capacity ||
        !tripType ||
        !sc
      ) {
        return res.status(400).json({
          status: false,
          message: "you have to fill the form",
        });
      }

      const flight = await Flight.create({
        code,
        airlineName,
        departureAirport,
        departure,
        arrivalAirport,
        arrival,
        date,
        returnDate,
        capacity,
        tripType: tripType.toLowerCase(),
        sc: sc.toLowerCase(),
        departureTime,
        arrivalTime,
        price,
      });

      return res.status(201).json({
        status: true,
        message: "Success create flight",
        data: flight,
      });
    } catch (err) {
      next(err);
    }
  },

  readDetailFlight: async (req, res, next) => {
    try {
      const { flightId } = req.params;

      const flightDetail = await Flight.findOne({
        where: { id: flightId },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (!flightDetail)
        return res
          .status(400)
          .json({ status: false, message: "flight data not found!" });

      return res.status(200).json({
        status: true,
        message: "Success get detail flights",
        data: flightDetail,
      });
    } catch (err) {
      next(err);
    }
  },

  read: async (req, res, next) => {
    try {
      const allFlight = await Flight.findAll({
        attributes: [
          "id",
          "code",
          "airlineName",
          "departureAirport",
          "departure",
          "arrivalAirport",
          "arrival",
          [sequelize.literal('date("date")'), "date"],
          [sequelize.literal('date("returnDate")'), "returnDate"],
          // 'date',
          "capacity",
          "tripType",
          "sc",
          "departureTime",
          "arrivalTime",
          "price",
        ],
      });

      if (allFlight <= 0) {
        return res.status(400).json({
          status: false,
          message: "No Flight",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Success Get All Data",
        data: allFlight,
      });
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const { flightId } = req.params;

      let {
        code,
        airlineName,
        departureAirport,
        departure,
        arrivalAirport,
        arrival,
        date,
        returnDate,
        capacity,
        tripType,
        sc,
        departureTime,
        arrivalTime,
        price,
      } = req.body;

      let flight = await Flight.findOne({
        where: {
          id: flightId,
        },
      });

      if (!flight) {
        return res.status(400).json({
          status: false,
          message: "flight not found",
          data: null,
        });
      }

      const updatedFlight = await flight.update(
        {
          code,
          airlineName,
          departureAirport,
          departure,
          arrivalAirport,
          arrival,
          date,
          returnDate,
          capacity,
          tripType,
          sc,
          departureTime,
          arrivalTime,
          price,
        },
        {
          where: {
            id: flightId,
          },
        }
      );

      return res.status(200).json({
        status: true,
        message: "Success update flight",
        data: updatedFlight,
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { flightId } = req.params;

      const flight = await Flight.findOne({
        where: {
          id: flightId,
        },
      });
      if (!flight) {
        return res.status(400).json({
          status: false,
          message: "flight not found",
          data: null,
        });
      }

      const deleted = await Flight.destroy({
        where: {
          id: flightId,
        },
      });

      return res.status(201).json({
        status: true,
        message: "delete flight success",
        data: deleted,
      });
    } catch (err) {
      next(err);
    }
  },
};
