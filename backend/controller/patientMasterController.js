const PatientMaster = require("../Schema/patientMaster");
const mongoose = require("mongoose");
const User = require("../Schema/userSchema");

const patientMasterController = {
  createThread: async (req, res, next) => {
    try {
      const {
        patientId,
        salutation,
        firstName,
        middleName,
        lastName,
        country,
        state,
        city,
        address,
        mobile,
        email,
        dateOfBirth,
        age,
        gender,
        ageType,
        patientType,
        bloodGroup,
        maritalStatus,
        priorityCard,
        value,
        percentage,
        userId,
      } = req.body;
      const newService = new PatientMaster({
        patientId,
        salutation,
        firstName,
        middleName,
        lastName,
        country,
        state,
        city,
        address,
        mobile,
        email,
        dateOfBirth,
        age,
        gender,
        ageType,
        patientType,
        bloodGroup,
        maritalStatus,
        priorityCard,
        value,
        percentage,
        userId,
      });
      const newServics = await newService.save();
      res.json({
        message: "Patient created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      console.log("This is userId", userId);
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const patient = await PatientMaster.find({ userId: usertobefound });
      // .populate({
      //   path: "services",
      //   populate: { path: "services" },
      // });

      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const patientID = req.params.patientId;
      const services = await PatientMaster.findById(patientID);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const patientID = req.params.patientId;
      const {
        patientId,
        salutation,
        firstName,
        middleName,
        lastName,
        country,
        state,
        city,
        address,
        mobile,
        email,
        dateOfBirth,
        age,
        gender,
        ageType,
        patientType,
        bloodGroup,
        maritalStatus,
        priorityCard,
        value,
        percentage,
      } = req.body;

      const newService = await PatientMaster.findByIdAndUpdate(
        patientID,
        {
          patientId,
          salutation,
          firstName,
          middleName,
          lastName,
          country,
          state,
          city,
          address,
          mobile,
          email,
          dateOfBirth,
          age,
          gender,
          ageType,
          patientType,
          bloodGroup,
          maritalStatus,
          priorityCard,
          value,
          percentage,
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Patient not found." });
      }
      console.log("This is newService", newService);
      res.json({ message: "Patient updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteThread: async (req, res, next) => {
    try {
      const patientID = req.params.patientId;
      const newService = await PatientMaster.findByIdAndDelete(patientID);
      if (!newService) {
        return res.status(404).json({ message: "Patient not found." });
      }

      res.json({ message: "Patient deleted successfully.", newService });
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
            index: "patient",
            autocomplete: {
              query: name,
              path: "firstName",
            },
          },
        },
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId), // Match userId with the correct type
          },
        },
      ];
      console.log(agg);

      const patient = await PatientMaster.aggregate(agg);
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getPatientByPriorityCard: async (req, res, next) => {
    try {
      const { query } = req.query;
      const patients = await PatientMaster.find({ priorityCard: true });

      // If no patients are found, return a message
      if (patients.length === 0) {
        return res.status(404).json({
          message: `No patients found with priorityCard: ${priorityCardBool}`,
        });
      }

      // Return the matching patients
      res.status(200).json(patients);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = patientMasterController;
