const { Flight } = require("../models");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { GOFLIGHTLABS_ACCESS_KEY } = process.env;

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        airlineName,
        code,
        departureCity,
        arrivalCity,
        departureTime,
        arrivalTime,
        totalSeat,
        classPassenger,
        gate,
        boardingTime,
        price,
        stock,
      } = req.body;

      if (
        !airlineName ||
        !code ||
        !departureCity ||
        !arrivalCity ||
        !departureTime ||
        !arrivalTime
      ) {
        return res.status(400).json({
          status: false,
          message: "you have to fill the form",
        });
      }

      const exist = await Flight.findOne({
        where: {
          code: code,
        },
      });

      if (exist) {
        return res.status(409).json({
          status: false,
          message: "flight already exist",
          data: null,
        });
      }

      const flight = await Flight.create({
        airlineName,
        code,
        departureCity,
        arrivalCity,
        departureTime,
        arrivalTime,
        totalSeat,
        classPassenger,
        gate,
        boardingTime,
        price,
        stock,
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

  read: async (req, res, next) => {
    try {
      const flight = await Flight.findAll();

      return res.status(200).json({
        status: true,
        message: "Success get data",
        data: flight,
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
        departureCity,
        arrivalCity,
        departureTime,
        arrivalTime,
        totalSeat,
        classPassenger,
        gate,
        boardingTime,
        price,
        stock,
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
          departureCity,
          arrivalCity,
          departureTime,
          arrivalTime,
          totalSeat,
          classPassenger,
          gate,
          boardingTime,
          price,
          stock,
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

  detailFlight: async (req, res, next) => {
    try {
      const { id } = req.params;

      const flight = await Flight.findOne({
        where: {
          id: id,
        },
      });

      if (!flight)
        return res.status(400).json({
          status: false,
          message: "your flight not found!",
        });

      return res.status(200).json({
        status: true,
        message: "successfully get your flight",
        data: flight,
      });
    } catch (err) {
      next(err);
    }
  },

  //show flight from goflightlabs API
  showFlight: async (req, res, next) => {
    try {
      const url = `https://app.goflightlabs.com/advanced-flights-schedules?access_key=${GOFLIGHTLABS_ACCESS_KEY}&status=active`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "app.goflightlabs.com",
        },
      };
      const result = await fetch(url, options);
      const json = await result.json();
      let flights = json.data;

      flights = flights.map((v) => {
        let field = {
          code: v.flight.iataNumber,
          airline: v.airline.name,
          departure: v.departure.iataCode,
          arrival: v.arrival.iataCode,
          // arrivalGate: v.arrival.gate,
          departureTime: v.departure.scheduledTime,
          arrivalTime: v.arrival.scheduledTime,
        };
        return field;
      });

      return res.status(200).json({
        status: true,
        message: "Success Get Data",
        data: flights,
      });
    } catch (error) {
      next(error);
    }
  },
};
