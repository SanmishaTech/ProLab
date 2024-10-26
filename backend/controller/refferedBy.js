const Reference = require("../Schema/referenceBy");
const mongoose = require("mongoose");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const { name, userId } = req.body;
      const newRefference = new Reference({
        name,
        userId,
      });
      const newRefferences = await newRefference.save();

      res.json({
        message: "Patients created successfully",
        reference: newRefferences,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      console.log(userId);
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const patient = await Reference.find({ userId: usertobefound });
      console.log(patient);
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const referenceId = req.params.referenceId;
      const reference = await Reference.findById(referenceId);
      res.status(200).json(reference);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const referenceId = req.params.referenceId;
      const { name } = req.body;

      const newService = await Reference.findByIdAndUpdate(
        referenceId,
        {
          name,
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
};
module.exports = Servicescontroller;
