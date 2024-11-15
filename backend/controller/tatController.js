const mongoose = require("mongoose");
const TatMaster = require("../Schema/tatmaster");

const tatController = {
  createThread: async (req, res) => {
    try {
      const {
        selectTest,
        startTime,
        endTime,
        hoursNeeded,
        urgentHours,
        weekday,
      } = req.body;

      const newService = new TatMaster({
        selectTest,
        startTime,
        endTime,
        hoursNeeded,
        urgentHours,
        weekday,
      });

      const newServices = await newService.save();

      res.json({
        message: "Service created successfully",
        service: newServices,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getServices: async (req, res) => {
    try {
      const tatTest = await TatMaster.find().populate("selectTest");
      res.status(200).json(tatTest);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getServicesbyId: async (req, res) => {
    try {
      const tatTestId = req.params.tatTestId;
      const services = await TatMaster.findById(tatTestId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateThreads: async (req, res) => {
    try {
      const tatTestId = req.params.tatTestId;
      const { 
        selectTest,
        startTime,
        endTime,
        hoursNeeded,
        urgentHours,
        weekday,
      } = req.body;

      const updatedService = await TatMaster.findByIdAndUpdate(
        tatTestId,
        {
          selectTest,
          startTime,
          endTime,
          hoursNeeded,
          urgentHours,
          weekday,
        },
        { new: true }
      );

      if (!updatedService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({
        message: "Service updated successfully.",
        service: updatedService,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteThread: async (req, res) => {
    try {
      const tatTestId = req.params.tatTestId;
      const deletedService = await TatMaster.findByIdAndDelete(tatTestId);

      if (!deletedService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({
        message: "Service deleted successfully.",
        service: deletedService,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = tatController;
