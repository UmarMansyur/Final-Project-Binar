const { Flight } = require("../../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

module.exports = {
  showFilter: async (req, res, next) => {
    try {
      const { departure, arrival, date } = req.query;

      const filterSearch = await Flight.findAll({
        attributes: [
          "code",
          "airlineName",
          "departureAirport",
          "departure",
          "arrivalAirport",
          "arrival",
          [sequelize.literal('date("date")'), "date"],
          [sequelize.literal('date("returnDate")'), "returnDate"],
          // 'date',
          "passengers",
          "tripType",
          "sc",
          "departureTime",
          "arrivalTime",
          "price",
        ],
      });

      // flights = filterSearch.map((v) => {
      //   return {
      //     code: v.code,
      //     name: v.airlineName,
      //     departure: v.departure,
      //     arrival: v.arrival,
      //     date: v.date,
      //     departureTime: v.departureTime,
      //     arrivalTime: v.arrivalTime,
      //   };
      // });

      // console.log('log:', req.query)
      // console.log(flights)

      const filters = req.query;
      console.log(req.path)
      const filteredUsers = filterSearch.filter((user) => {
        let isValid = true;
        for (key in filters) {
          console.log(key, user[key], filters[key]);
          isValid = isValid && user[key] == filters[key];
        }
        return isValid;
      });

      // if (filteredUsers < 1)
      //   return res.status(400).json({
      //     status: false,
      //     message: `flight schedule with ${filters.departure} departure and ${filters.arrival} arrival on ${filters.date} for ${filters.passenger} passengers not found`,
      //   });

      // for (const flight of flights) {
      //   await Flight.create({
      //     airlineName: flight.airline.name,
      //     code: flight.flight.iataNumber,
      //     departureCity: flight.departure.iataCode,
      //     arrivalCity: flight.arrival.iataCode,
      //     departureTime: flight.departure.scheduledTime,
      //     arrivalTime: flight.arrival.scheduledTime,
      //   });
      // }

      return res.status(200).json({
        status: true,
        message: "Success Get Data",
        data: filteredUsers,
      });

      // if (filterSearch <= 0) {
      //   return res.status(400).json({
      //     status: false,
      //     message: "Empty Flight",
      //     data: null,
      //   });
      // }

      // const result = [];
      // for (const flightSearch of filterSearch) {
      //   // const departureDate = flightSearch.departureTime.toDateString();
      //   // const departureTime = flightSearch.departureTime.toLocaleTimeString();
      //   // const arrivalDate = flightSearch.arrivalTime.toDateString();
      //   // const arrivalTime = flightSearch.arrivalTime.toLocaleTimeString();
      //   const showFlight = {
      //     code: flightSearch.code,
      //     airlineName: flightSearch.airlineName,
      //     departureAirport: flightSearch.departureAirport,
      //     departure: flightSearch.departure,
      //     arrivalAirport: flightSearch.arrivalAirport,
      //     arrival: flightSearch.arrival,
      //     date: flightSearch.date,
      //     departureTime: flightSearch.departureTime,
      //     arrivalTime: flightSearch.arrivalTime,
      //     price: flightSearch.price,
      //   };

      //   result.push(showFlight);
      // }

      // return res.status(200).json({
      //   status: true,
      //   message: "Success Get Data",
      //   data: result,
      // });
    } catch (error) {
      next(error);
    }
  },
};
