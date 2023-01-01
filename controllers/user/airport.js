const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  getPort: async (req, res, next) => {
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
    } catch (err) {
      next(err);
    }
  },

  getIndoAirport: async (req, res, next) => {
    try {
      const url =
        "https://gist.githubusercontent.com/aroyan/89b170c9f76df8f76c31d3fe1b1d33df/raw/5b6f528c5cb2ccb3e519974d613a14651085d497/allAirportInIndonesia.json";
      const options = {
        method: "GET",

        headers: {
          "X-RapidAPI-Host": "gist.githubusercontent.com",
        },
      };
      const result = await fetch(url, options);
      const json = await result.json();
      const airports = json;

      const indonesiaAirport = [];
      for (const airport of airports) {
        const schedule = {
          airportCode: airport.airportCode,
          airportName: airport.airportName,
          airportLocation: airport.airportLocation,
          cityName: airport.cityName,
          countryName: airport.countryName,
          alias: airport.alias,
        };

        indonesiaAirport.push(schedule);
      }
      return res.status(200).json({
        status: true,
        message: "Success Get Data",
        data: indonesiaAirport,
      });
    } catch (err) {
      next(err);
    }
  },

  getAllAirport: async (req, res, next) => {
    try {
      const url =
        "https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json";
      const options = {
        method: "GET",

        headers: {
          "X-RapidAPI-Host": "gist.githubusercontent.com",
        },
      };
      const result = await fetch(url, options);
      const json = await result.json();
      const airports = json;

      const allAirport = [];
      for (const airport of airports) {
        const schedule = {
          airportCode: airport.code,
          airportName: airport.name,
          airportLocation: airport.state,
          cityName: airport.city,
          countryName: airport.country,
        };

        allAirport.push(schedule);
      }
      return res.status(200).json({
        status: true,
        message: "Success Get Data",
        data: allAirport,
      });
    } catch (error) {
      next(err);
    }
  },
};
