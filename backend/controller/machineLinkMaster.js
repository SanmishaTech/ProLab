const MachineMaster = require("../Schema/machineLinkMaster");
const mongoose = require("mongoose");

const machineController = {
  createThread: async (req, res, next) => {
    try {
      const { name, test } = req.body;
      const newService = new MachineMaster({
        name,
        test,
      });
      const newServics = await newService.save();

      res.json({
        message: "Machine created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const machine = await MachineMaster.find()
        .populate({
          path: "name",
        })
        .populate({
          path: "test",
        });
      res.status(200).json(machine);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const machineId = req.params.machineId;
      const services = await MachineMaster.findById(machineId)
        .populate({
          path: "name",
        })
        .populate({
          path: "test",
        });
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const machineId = req.params.machineId;
      const { name, test } = req.body;

      const newService = await MachineMaster.findByIdAndUpdate(
        machineId,
        {
          name,
          test,
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Machine not found." });
      }

      res.json({ message: "Machine updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const machineId = req.params.machineId;
      const newService = await MachineMaster.findByIdAndDelete(machineId);
      if (!newService) {
        return res.status(404).json({ message: "Machine not found." });
      }

      res.json({ message: "Machine deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = machineController;
