const MakerChecker = require("../Schema/makerchecker");
const mongoose = require("mongoose");

const machineController = {
  createThread: async (req, res, next) => {
    try {
      const { department, checker, level, test, userId } = req.body;
      const newService = new MakerChecker({
        department,
        checker,
        level,
        test,
        userId,
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
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const machine = await MakerChecker.find({ userId: usertobefound })
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
      const services = await MakerChecker.findById(machineId)
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
      const { department, checker, level, test, userId } = req.body;

      const newService = await MakerChecker.findByIdAndUpdate(
        machineId,
        {
          department,
          checker,
          level,
          test,
          userId,
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
      const newService = await MakerChecker.findByIdAndDelete(machineId);
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
