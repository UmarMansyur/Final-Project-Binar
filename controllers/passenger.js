const { User, Passenger } = require("../models");
const multer = require('multer');
const upload = multer();
const imagekit = require('../utils/imagekit');

module.exports = {
  show: async (req, res, next) => {
    try {
      const ticket = await Passenger.findAll({ where: { id: req.user.id } });
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
        data: ticket
      });
    } catch (err) {
      next(err);
    }
  },

  passenger: async (req, res, next) => {
    try{
      const user = req.user;
      const { email, firstName, lastName, phone, type, travelDocument } = req.body;

      const usercompare = await User.findOne({ 
        where: { 
            id: user.id
        }});
    if (!usercompare) {
        return res.status(400).json({
            status: false,
            message: 'user not found!'
        })
    }

    const emailcompare = await User.findOne({ 
      where: { 
          email: usercompare.email
      }});
  if (!emailcompare) {
      return res.status(400).json({
          status: false,
          message: 'e-mail must use the e-mail registered to this account!'
      })
  }
  
    const file = req.file.buffer.toString("base64");

    const uploadedFile = await imagekit.upload({
        file,
        fileName: req.file.originalname
    })

    const image = uploadedFile.url;

    const uploadedFile1 = await Passenger.create({
        id: user.id,
        email,
        firstName,
        lastName,
        phone,
        type,
        travelDocument: image
        
    })

    return res.status(200).json({
        status: true,
        message: 'success upload document',
        data: uploadedFile1
    });

    }catch (err){
      next(err)
    }
  }
};
