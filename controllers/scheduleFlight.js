const { Flight } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  showFilter: async (req, res, next) => {
    try {
      const { departure, arrival } = req.query;

      const filterSearch = await Flight.findAll({
        where: {
          [Op.and]: [{ departure }, { arrival }],
        },
      });

      if (filterSearch <= 0) {
        return res.status(400).json({
          status: false,
          message: "Empty Flight",
          data: null,
        });
      }

      const result = [];
      for (const flightSearch of filterSearch) {
        // const departureDate = flightSearch.departureTime.toDateString();
        // const departureTime = flightSearch.departureTime.toLocaleTimeString();
        // const arrivalDate = flightSearch.arrivalTime.toDateString();
        // const arrivalTime = flightSearch.arrivalTime.toLocaleTimeString();
        const showFlight = {
          code: flightSearch.code,
          airlineName: flightSearch.airlineName,
          departureAirport: flightSearch.departureAirport,
          departure: flightSearch.departure,
          arrivalAirport: flightSearch.arrivalAirport,
          arrival: flightSearch.arrival,
          date: flightSearch.date,
          departureTime: flightSearch.departureTime,
          arrivalTime: flightSearch.arrivalTime,
          price: flightSearch.price,
        };

        result.push(showFlight);
      }

      return res.status(200).json({
        status: true,
        message: "Success Get Data",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
