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
      // const userId = req.params.userId;
      // const usertobefound = new mongoose.Types.ObjectId(userId);
      const doctor = await AssociateMaster.find();
      // .populate({
      //   path: "services",
      //   populate: { path: "services" },
      // });

      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const doctorId = req.params.referenceId;
      const services = await AssociateMaster.findById(doctorId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const doctorId = req.params.associateId;
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
        doctorId,
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
      const doctorId = req.params.specimenId;
      const newService = await AssociateMaster.findByIdAndDelete(doctorId);
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
