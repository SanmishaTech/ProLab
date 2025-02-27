const Container = require("../Schema/container");
const mongoose = require("mongoose");

const ContainerController = {
  createThread: async (req, res, next) => {
    try {
      const { container, userId } = req.body;
      const newContainer = new Container({
        container,
        userId,
      });
      const newServics = await newContainer.save();
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
      const doctor = await Container.find({ userId: usertobefound });
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
      const services = await Container.findById(doctorId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const doctorId = req.params.departmentId;
      const { container, userId } = req.body;

      const newService = await Container.findByIdAndUpdate(
        doctorId,
        {
          container,
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
      const doctorId = req.params.specimenId;
      const newService = await Container.findByIdAndDelete(doctorId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = ContainerController;
