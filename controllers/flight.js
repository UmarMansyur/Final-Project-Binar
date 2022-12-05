const { Flight } = require("../models");

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
        code,
        airline_name,
        departure_city,
        arrival_city,
        departure_time,
        arrival_time,
        total_seat,
        class_passenger,
        gate,
        boarding_time,
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
        airline_name,
        departure_city,
        arrival_city,
        departure_time,
        arrival_time,
        total_seat,
        class_passenger,
        gate,
        boarding_time,
        price,
        stock,
      });

      return res.status(201).json({
        status: true,
        message: "flight created",
        data: flight,
      });
    } catch (err) {
      next(err);
    }
  },

  read: async (req, res, next) => {
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

      return res.status(200).json({
        status: true,
        message: "Success get detail flight",
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
        airline_name,
        departure_city,
        arrival_city,
        departure_time,
        arrival_time,
        total_seat,
        class_passenger,
        gate,
        boarding_time,
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
          airline_name,
          departure_city,
          arrival_city,
          departure_time,
          arrival_time,
          total_seat,
          class_passenger,
          gate,
          boarding_time,
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
