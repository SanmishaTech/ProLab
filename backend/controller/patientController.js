const Patient = require("../Schema/patient");
const User = require("../Schema/userSchema");
const mongoose = require("mongoose");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const { name, age, phone, gender, userId } = req.body;
      const newPatient = await new Patient({
        name,
        age,
        phone,
        gender,
        userId,
      });
      const newPatients = await newPatient.save();

      res.json({
        message: "Patients created successfully",
        patient: newPatients,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const patient = await Patient.find();
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const patientId = req.params.patientId;
      const services = await Patient.findById(patientId);
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
            index: "          ", // Check if 'lab' is correctly configured in your MongoDB Atlas Search
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

      const patient = await Patient.aggregate(agg);
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const patientId = req.params.patientId;
      const { name, age, phone, gender } = req.body;

      const newService = await Patient.findByIdAndUpdate(
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
module.exports = Servicescontroller;
