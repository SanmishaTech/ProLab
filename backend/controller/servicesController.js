const Service = require("../Schema/services");
const mongoose = require("mongoose");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const {
        name,
        description,
        price,
        userId,
        durationInDays,
        urgentDuration,
        urgent,
        urgentPrice,
      } = req.body;
      const newService = new Service({
        name,
        description,
        price,
        userId,
        durationInDays,
        urgentDuration,
        urgent,
        urgentPrice,
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

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid user ID." });
      }

      const services = await Service.find({ userId });

      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const serviceId = req.params.serviceId;
      const services = await Service.findById(serviceId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const serviceId = req.params.serviceId;
      const { name, description, price, durationindays, urgentduration } =
        req.body;

      const newService = await Service.findByIdAndUpdate(
        serviceId,
        { name, description, price, durationindays, urgentduration },
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
