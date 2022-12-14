const { Flight } = require("../../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

module.exports = {
  showFilter: async (req, res, next) => {
    try {

      const filterSearch = await Flight.findAll({
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
          "passengers",
          "tripType",
          "sc",
          "departureTime",
          "arrivalTime",
          "price",
        ],
      });

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

      if (filters.tripType == 'one_way') {
        flights = filteredUsers.map((v) => {
          return {
            id: v.id,
            code: v.code,
            name: v.airlineName,
            departureAirport: v.departureAirport,
            departure: v.departure,
            arrivalAirport: v.arrivalAirport,
            arrival: v.arrival,
            date: v.date,
            passengers: v.passengers,
            tripType: v.tripType,
            sc: v.sc,
            departureTime: v.departureTime,
            arrivalTime: v.arrivalTime
          }
         })
        }else {
            flights = filteredUsers.map((v) => {
              return {
                id: v.id,
                code: v.code,
                name: v.airlineName,
                departureAirport: v.departureAirport,
                departure: v.departure,
                arrivalAirport: v.arrivalAirport,
                arrival: v.arrival,
                date: v.date,
                returnDate: v.returnDate,
                passengers: v.passengers,
                tripType: v.tripType,
                sc: v.sc,
                departureTime: v.departureTime,
                arrivalTime: v.arrivalTime,
          }
        })
          
        };      

      if (filteredUsers < 1)
        return res.status(400).json({
          status: false,
          message: `flight schedule not found`,
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

  detailFlight: async (req, res, next) => {
    try {
      const { flightId } = req.params;

      const flightDetail = await Flight.findOne({ where: { id: flightId }, attributes: { exclude: ["createdAt", "updatedAt"] } })

      if (!flightDetail) return res.status(400).json({ status: false, message: 'flight data not found!' })

      if (flightDetail.tripType == 'one_way') {
        flight = {
        id: flightDetail.id,
        code: flightDetail.code,
        airlineName: flightDetail.airlineName,
        departureAirport: flightDetail.departureAirport,
        departure: flightDetail.departure,
        arrivalAirport: flightDetail.arrivalAirport,
        arrival: flightDetail.arrival,
        date: flightDetail.date,
        passengers: flightDetail.passengers,
        tripType: flightDetail.tripType,
        sc: flightDetail.sc,
        departureTime: flightDetail.departureTime,
        arrivalTime: flightDetail.arrivalTime,
        price: flightDetail.price
        }
      } else {
         flight = {
          id: flightDetail.id,
          code: flightDetail.code,
          airlineName: flightDetail.airlineName,
          departureAirport: flightDetail.departureAirport,
          departure: flightDetail.departure,
          arrivalAirport: flightDetail.arrivalAirport,
          arrival: flightDetail.arrival,
          date: flightDetail.date,
          returnDate: flightDetail.returnDate,
          passengers: flightDetail.passengers,
          tripType: flightDetail.tripType,
          sc: flightDetail.sc,
          departureTime: flightDetail.departureTime,
          arrivalTime: flightDetail.arrivalTime,
          price: flightDetail.price
          }
      }

      return res.status(200).json({
        status: true,
        message: flight
      })
    }catch (err){
      next(err);
    }
  }
};
