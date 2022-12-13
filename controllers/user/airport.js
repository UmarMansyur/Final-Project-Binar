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
    } catch (error) {
      next(err);
    }
  },

  getIndoAirport: async (req, res, next) => {
    try {
      const url =
        "https://gist.githubusercontent.com/aroyan/89b170c9f76df8f76c31d3fe1b1d33df/raw/361448fca988b0c1d9ff6b3c5d0f51dbeeda388a/allAirportInIndonesia.json";
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
    } catch (error) {
      next(err);
    }
  },
};
