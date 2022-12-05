const { Flight } = require("../models");

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
};
