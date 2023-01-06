const { Op } = require("sequelize");
const { Flight } = require("../../models");
const sequelize = require("sequelize");
const flight = require("../../models/flight");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  create: async (req, res, next) => {
    try {
      let {
        code,
        airlineIata,
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

      switch ((airlineIata = airlineIata.toUpperCase())) {
        case "JT":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/JT.png";
          break;
        case "IU":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/IU.png";
          break;
        case "QZ":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/QZ.png";
          break;
        case "QG":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/QG.png";
          break;
        case "GA":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/GA.png";
          break;
        case "ID":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/ID.png";
          break;
        case "IW":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/IW.png";
          break;
        case "MH":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/MH.png";
          break;
        case "SQ":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/SQ.png";
          break;
        default:
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/EK.png";
      }

      if (
        !airlineName ||
        !airlineIata ||
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
        code: code.toUpperCase(),
        airlineIata: airlineIata.toUpperCase(),
        airlineLogo,
        airlineName,
        departureAirport,
        departure: departure.toUpperCase(),
        arrivalAirport,
        arrival: arrival.toUpperCase(),
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
      const { limit = 5, page = 1, order = "id", by = "ASC" } = req.query;
      const offset = (page - 1) * limit;
      const { count, rows } = await Flight.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [[order, by.toUpperCase()]],
        attributes: [
          "id",
          "code",
          "airlineIata",
          "airlineLogo",
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
      const totalPage = Math.ceil(count / limit);
      const totalData = count;

      if (count <= 0) {
        return res.status(400).json({
          status: false,
          message: "Flights not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Success Get All Data",
        data: {
          page: parseInt(page),
          totalPage,
          totalData,
          rows,
        },
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
        airlineIata,
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

      switch ((airlineIata = airlineIata.toUpperCase())) {
        case "JT":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/JT.png";
          break;
        case "IU":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/IU.png";
          break;
        case "QZ":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/QZ.png";
          break;
        case "QG":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/QG.png";
          break;
        case "GA":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/GA.png";
          break;
        case "ID":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/ID.png";
          break;
        case "IW":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/IW.png";
          break;
        case "MH":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/MH.png";
          break;
        case "SQ":
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/SQ.png";
          break;
        default:
          airlineLogo =
            "https://sta.nusatrip.net/static/img/front/V2/icon-flight/EK.png";
      }

      const updatedFlight = await flight.update(
        {
          code,
          airlineIata,
          airlineName,
          airlineLogo,
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
