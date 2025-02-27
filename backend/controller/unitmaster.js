const Reason = require("../Schema/unitmaster");
const mongoose = require("mongoose");

const reasonController = {
  createThread: async (req, res, next) => {
    try {
      const { unit, description, userId } = req.body;
      const newService = new Reason({
        unit,
        description,
        userId,
      });
      const newServics = await newService.save();

      res.json({
        message: "Reason created successfully",
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
      const reason = await Reason.find({ userId: usertobefound });
      res.status(200).json(reason);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const reasonID = req.params.reasonId;
      const services = await Reason.findById(reasonID);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  searchbyName: async (req, res, next) => {
    try {
      const name = req.params.name;
      const userId = req.params.userId;

      // Use mongoose to find user first if necessary
      const userwithid = await Reason.findById(userId);
      if (!userwithid) {
        return res.status(404).json({ message: "User not found." });
      }

      const agg = [
        {
          $search: {
            index: "lab", // Check if 'lab' is correctly configured in your MongoDB Atlas Search
            autocomplete: {
              query: name,
              path: "name",
            },
          },
        },
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId), // Match userId with the correct type
          },
        },
      ];

      const patient = await Parameter.aggregate(agg);
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const reasonID = req.params.reasonId;
      const { unit, description, userId } = req.body;

      const newService = await Reason.findByIdAndUpdate(
        reasonID,
        {
          unit,
          description,
          userId,
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Reason updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const patientId = req.params.reasonId;
      const newService = await Reason.findByIdAndDelete(patientId);
      if (!newService) {
        return res.status(404).json({ message: "Reason not found." });
      }

      res.json({ message: "Reason deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = reasonController;
