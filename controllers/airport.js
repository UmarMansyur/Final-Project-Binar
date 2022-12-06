const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { GOFLIGHTLABS_ACCESS_KEY } = process.env;

module.exports = {
  getPort: async (req, res) => {
    try {
      const { search } = req.params;

      const url = `https://port-api.com/airport/search/${search}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "port-api.com",
        },
      };
      const result = await fetch(url, options);
      const json = await result.json();
      let data = json.features;
      data = data.filter((v) => {
        return v.properties.source == "ourairports";
      });
      data = data.map((v) => {
        let field = {
          iata: v.properties.iata,
          name: v.properties.name,
          region: v.properties.region.name,
          country: v.properties.country.name,
        };
        return field;
      });
      return res.status(200).json({
        status: true,
        message: "Success Get Data",
        data: data,
      });
    } catch (error) {
      next(err);
    }
  },

  showFlight: async (req, res) => {
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
      const flights = json.data;

      const flightSchedule = [];
      for (const flight of flights) {
        const schedule = {
          code: flight.flight.iataNumber,
          airline: flight.airline.name,
          departure: flight.departure.iataCode,
          arrival: flight.arrival.iataCode,
          departureTime: flight.departure.scheduledTime,
          arrivalTime: flight.arrival.scheduledTime,
        };

        flightSchedule.push(schedule);
      }
      return res.status(200).json({
        status: true,
        message: "Success Get Flight Data",
        data: flightSchedule,
      });
    } catch (error) {
      next(error);
    }
  },
};
