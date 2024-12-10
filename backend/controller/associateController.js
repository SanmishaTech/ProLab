const AssociateMaster = require("../Schema/associatemaster");
const mongoose = require("mongoose");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const {
        associateType,
        salutation,
        firstName,
        lastName,
        organization,
        country,
        state,
        city,
        address,
        telephone,
        mobile,
        email,
        degree,
        userId,
      } = req.body;
      const newService = new AssociateMaster({
        associateType,
        salutation,
        firstName,
        lastName,
        organization,
        country,
        state,
        city,
        address,
        telephone,
        mobile,
        email,
        degree,
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
      const associate = await AssociateMaster.find({ userId: usertobefound });
      // .populate({
      //   path: "services",
      //   populate: { path: "services" },
      // });

      res.status(200).json(associate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const associateId = req.params.referenceId;
      const services = await AssociateMaster.findById(associateId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const associateId = req.params.associateId;
      const {
        associateType,
        salutation,
        firstName,
        lastName,
        organization,
        country,
        state,
        city,
        address,
        telephone,
        mobile,
        email,
        degree,
      } = req.body;

      const newService = await AssociateMaster.findByIdAndUpdate(
        associateId,
        {
          associateType,
          salutation,
          firstName,
          lastName,
          organization,
          country,
          state,
          city,
          address,
          telephone,
          mobile,
          email,
          degree,
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
      const associateId = req.params.specimenId;
      const newService = await AssociateMaster.findByIdAndDelete(associateId);
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
