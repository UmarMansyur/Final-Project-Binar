const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
  getPort: async (req, res) => {
    try {
      const { search } = req.params;

      const url = `https://port-api.com/airport/suggest/${search}`;
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "port-api.com",
        },
      };
      const result = await fetch(url, options);
      const json = await result.json();
      let data = json.features[0].properties;

      return res.status(200).json({
        status: true,
        message: "Success Get Data",
        data: data,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
