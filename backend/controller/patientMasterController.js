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
      const usertobefound = new mongoose.Types.ObjectId(userId);

      // Extract pagination and search parameters from query with defaults
      let { page = 1, limit = 10, search = "" } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const skip = (page - 1) * limit;

      // Build the query condition
      const query = { userId: usertobefound };
      console.log("Search", search, query);
      if (search.trim()) {
        query.$or = [
          { firstName: { $regex: `^${search}`, $options: "i" } },
          { mobile: { $regex: `^${search}`, $options: "i" } },
        ];
      }

      // Execute both the paginated query and count in parallel
      const [patients, total] = await Promise.all([
        PatientMaster.find(query).skip(skip).limit(limit).lean(),
        PatientMaster.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      res.status(200).json({
        patients,
        total,
        page,
        totalPages,
        nextPage,
        prevPage,
      });
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
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);

      // Extract pagination and search parameters from query with defaults
      let { page = 1, limit = 20, search = "" } = req.query;
      console.log(search);
      page = parseInt(page);
      limit = parseInt(limit);
      const skip = (page - 1) * limit;

      // Build the query condition
      const query = { userId: usertobefound };
      if (search.trim()) {
        query.$or = [{ firstName: { $regex: `^${search}`, $options: "i" } }];
      }

      // Execute both the paginated query and count in parallel
      const [patients, total] = await Promise.all([
        PatientMaster.find(query).skip(skip).limit(limit).lean(),

        PatientMaster.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);
      const nextPage = page < totalPages ? page + 1 : null;
      const prevPage = page > 1 ? page - 1 : null;

      res.status(200).json(patients);
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
