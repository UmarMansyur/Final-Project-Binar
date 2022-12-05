const { Flight } = require("../models");

const { Op } = require("sequelize");

module.exports = {
  create: async (req, res, next) => {
    try {
      const {
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
        code: code,
        capacity: capacity,
        current_airport: current_airport,
        is_ready: is_ready,
        is_maintain: is_maintain,
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
  index: async (req, res, next) => {
    try {
      let { sort = "code", type = "ASC", search = "" } = req.query;
      const allFlight = await Flight.findAll({
        where: {
          // [Op.or]: [
          // {
          //     id: {
          //         [Op.gt]: 0
          //     }
          // },
          // {
          code: {
            [Op.iLike]: `%${search}%`,
          },
          // }
          // {
          //     current_airport: parseInt(search)
          // }
          // ]
        },
        order: [
          ["is_ready", "desc"],
          [sort, type],
        ],
      });

      if (!allFlight) {
        return res.status(400).json({
          status: false,
          message: "flight not found",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "get all flight success",
        data: allFlight,
      });
    } catch (err) {
      next(err);
    }
  },
  show: async (req, res, next) => {
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
        message: "get detail of flight success",
        data: flight,
      });
    } catch (err) {
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      const { flightId } = req.params;

      let { code, capacity, current_airport, is_ready, is_maintain } = req.body;

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

      if (!code) code = flight.code;
      if (!capacity) capacity = flight.capacity;
      if (!current_airport) current_airport = flight.current_airport;
      if (!is_ready) is_ready = flight.is_ready;
      if (!is_maintain) is_maintain = flight.is_maintain;

      if (is_maintain == true) is_ready = false;

      const updated = await flight.update(
        {
          code: code,
          capacity: capacity,
          current_airport: current_airport,
          is_ready: is_ready,
          is_maintain: is_maintain,
        },
        {
          where: {
            id: flightId,
          },
        }
      );

      return res.status(200).json({
        status: true,
        message: "update flight success",
        data: updated,
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
