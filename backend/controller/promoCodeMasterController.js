const PromoCodeMaster = require("../Schema/promoCodeMaster");
const mongoose = require("mongoose");

const promoCodeMasterController = {
  createThread: async (req, res, next) => {
    try {
      const { promoCode, description, promoType, value, validityDate } =
        req.body;
      const newService = new PromoCodeMaster({
        promoCode,
        description,
        promoType,
        value,
        validityDate,
      });
      const newServics = await newService.save();
      res.json({
        message: "Promo Code created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      // const userId = req.params.userId;
      // const usertobefound = new mongoose.Types.ObjectId(userId);
      const promoCode = await PromoCodeMaster.find();
      // .populate({
      //   path: "services",
      //   populate: { path: "services" },
      // });

      res.status(200).json(promoCode);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const promocodeID = req.params.promocodeId;
      const services = await PromoCodeMaster.findById(promocodeID);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const promocodeID = req.params.promocodeId;
      const { promoCode, description, promoType, value, validityDate } =
        req.body;

      const newService = await PromoCodeMaster.findByIdAndUpdate(
        promocodeID,
        {
          promoCode,
          description,
          promoType,
          value,
          validityDate,
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Promo Code not found." });
      }

      res.json({ message: "Promo Code updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const promocodeID = req.params.promocodeId;
      const newService = await PromoCodeMaster.findByIdAndDelete(promocodeID);
      if (!newService) {
        return res.status(404).json({ message: "Promo Code not found." });
      }

      res.json({ message: "Promo Code deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = promoCodeMasterController;
