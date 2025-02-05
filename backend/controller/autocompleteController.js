const AutoComplete = require("../Schema/autocomplete");
const mongoose = require("mongoose");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const { parameterId, defaultValue, abnormal, message, userId } = req.body;
      const newService = new AutoComplete({
        parameterId,
        defaultValue,
        abnormal,
        message,
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
      const parameterId = req.params.parameterId;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const parameterIdfound = new mongoose.Types.ObjectId(parameterId);
      const associate = await AutoComplete.find({
        userId: usertobefound,
        parameterId: parameterIdfound,
      }).populate("parameterId");
      //

      res.status(200).json(associate);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const associateId = req.params.referenceId;
      const services = await AutoComplete.findById(associateId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const associateId = req.params.registrationId;
      const { parameterId, defaultValue, abnormal, message } = req.body;

      const newService = await AutoComplete.findByIdAndUpdate(
        associateId,
        {
          parameterId,
          defaultValue,
          abnormal,
          message,
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
      const newService = await AutoComplete.findByIdAndDelete(associateId);
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
