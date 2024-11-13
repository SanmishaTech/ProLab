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
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      } = req.body;
      const newService = new TatMaster({
        selectTest,
        startTime,
        endTime,
        hoursNeeded,
        urgentHours,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      });
      const newServices = await newService.save();
      res,
        json({
          message: "Service created successfully",
          service: newServices,
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getServices: async (res) => {
    const tatTest = await TatMaster.find();
    res.status(200).json(tatTest);
  },
  catch(error) {
    res.status(500).json({ error: error.message });
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
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      } = req.body;
      const newService = await TatMaster.findByIdAndUpdate(
        tatTestId,
        {
          selectTest,
          startTime,
          endTime,
          hoursNeeded,
          urgentHours,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
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

  deleteThread: async (req, res) => {
    try {
      const tatTestId = req.params.tatTestId;
      const newService = await TatMaster.findByIdAndDelete(tatTestId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
