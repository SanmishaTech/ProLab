const Parameter = require("../Schema/parameters");
const User = require("../Schema/userSchema");
const mongoose = require("mongoose");

const parameterController = {
  createThread: async (req, res, next) => {
    try {
      const { name, unit, fieldType } = req.body;
      const newService = new Parameter({
        name,
        unit,
        fieldType,
      });
      const newServics = await newService.save();

      res.json({
        message: "Patients created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      //   const userId = req.params.userId;
      //   const usertobefound = new mongoose.Types.ObjectId(userId);
      //   const patient = await Parameter.find({
      //     userId: usertobefound,
      //   });
      const parameter = await Parameter.find();
      res.status(200).json(parameter);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const patientId = req.params.patientId;
      const services = await Parameter.findById(patientId);
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
      const userwithid = await User.findById(userId);
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
      const patientId = req.params.patientId;
      const { name, age, phone, gender } = req.body;

      const newService = await Parameter.findByIdAndUpdate(
        patientId,
        {
          name,
          age,
          phone,
          gender,
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
module.exports = parameterController;
