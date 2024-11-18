const PatientMaster = require("../Schema/patientMaster");
const mongoose = require("mongoose");

const patientMasterController = {
  createThread: async (req, res, next) => {
    try {
      const {
        hfaId,
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
      } = req.body;
      const newService = new PatientMaster({
        hfaId,
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
      // const userId = req.params.userId;
      // const usertobefound = new mongoose.Types.ObjectId(userId);
      const patient = await PatientMaster.find();
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
        hfaId,
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
      } = req.body;

      const newService = await PatientMaster.findByIdAndUpdate(
        patientID,
        {
          hfaId,
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
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Patient not found." });
      }

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
};
module.exports = patientMasterController;
