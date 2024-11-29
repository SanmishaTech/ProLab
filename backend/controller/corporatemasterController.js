const CorporateMaster = require("../Schema/corporatemaster");
const mongoose = require("mongoose");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const {
        corporateCode,
        corporateName,
        country,
        state,
        city,
        address,
        discount,
        value,
        userId,
      } = req.body;
      const newService = new CorporateMaster({
        corporateCode,
        corporateName,
        country,
        state,
        city,
        address,
        discount,
        value,
        userId,
      });
      const newServics = await newService.save();
      res.json({
        message: "Service created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const corporate = await CorporateMaster.find({ userId: usertobefound });

      res.status(200).json(corporate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const corporateId = req.params.referenceId;
      const services = await CorporateMaster.findById(corporateId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const corporateId = req.params.corporateId;
      const {
        corporateCode,
        corporateName,
        country,
        state,
        city,
        address,
        discount,
        value,
        userId,
      } = req.body;

      const newService = await CorporateMaster.findByIdAndUpdate(
        corporateId,
        {
          corporateCode,
          corporateName,
          country,
          state,
          city,
          address,
          discount,
          value,
          userId,
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const corporateId = req.params.specimenId;
      const newService = await CorporateMaster.findByIdAndDelete(corporateId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = Servicescontroller;
