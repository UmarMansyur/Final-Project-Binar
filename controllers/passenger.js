const { Passenger } = require("../models");

module.exports = {
  show: async (req, res, next) => {
    try {
      const { id } = req.params;
      const ticket = await Passenger.findOne({ where: { id: id } });
      if (!ticket) {
        return res.status(400).json({
          status: false,
          message: "ticket not found",
          data: null,
        });
      }
      return res.status(200).json({
        status: true,
        message: "get ticket success",
        data: ticket.get(),
      });
    } catch (err) {
      next(err);
    }
  },
};
