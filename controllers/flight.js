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
      const { departure, arrival, date } = req.query;
      const uri = [`https://app.goflightlabs.com/flights?access_key=${GOFLIGHTLABS_ACCESS_KEY}&flight_status=scheduled`];
      if (departure) {
        uri.push(`&dep_iata=${departure}`);
      }
      if (arrival) {
        uri.push(`&arr_iata=${arrival}`);
      }
      if(date) {
        uri.push(`&arr_scheduled_time_dep=${date}`);
      }
      const url = uri.join('');
      console.log(url);
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "app.goflightlabs.com",
        },
      };
      const result = await fetch(url, options);
      const json = await result.json();
      let flights = json;
      if(flights.success == false) {
        return res.status(400).json({
          status: false,
          message: flights.message,
        });
      }
      flights = flights.map((v) => {
        return {
          code : v.flight.number,
          name: v.airline.name,
          departure: v.departure.iata,
          arrival: v.arrival.iata,
          departureTime: v.departure.scheduled,
          arrivalTime: v.arrival.scheduled,
        }
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
