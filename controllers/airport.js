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
};
