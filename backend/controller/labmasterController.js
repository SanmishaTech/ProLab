const Holiday = require("../Schema/labmaster");
const User = require("../Schema/userSchema");
const mongoose = require("mongoose");

const holidayController = {
  createThread: async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        employeeCode,
        email,
        mobileNo,
        country,
        state,
        city,
        address1,
        address2,
        pinCode,
        userId,
      } = req.body;

      const findingexisting = await Holiday.findOne({ userId });
      if (findingexisting) {
        const existing = await Holiday.findByIdAndUpdate(findingexisting._id, {
          firstName,
          lastName,
          employeeCode,
          email,
          mobileNo,
          country,
          state,
          city,
          address1,
          address2,
          pinCode,
          userId,
        });
        return res
          .status(200)
          .json({ message: "User Updated sucessfully.", existing: existing });
      }
      const newService = new Holiday({
        firstName,
        lastName,
        employeeCode,
        email,
        mobileNo,
        country,
        state,
        city,
        address1,
        address2,
        pinCode,
        userId,
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
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const patient = await Holiday.find({ userId: usertobefound });
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const patientId = req.params.referenceId;

      const services = await Holiday.findById(patientId);
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

      const patient = await Holiday.aggregate(agg);
      res.status(200).json(patient);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const patientId = req.params.referenceId;
      const {
        firstName,
        lastName,
        employeeCode,
        email,
        mobileNo,
        country,
        state,
        city,
        address1,
        address2,
        pinCode,
        userId,
      } = req.body;

      const newService = await Holiday.findByIdAndUpdate(
        patientId,
        {
          firstName,
          lastName,
          employeeCode,
          email,
          mobileNo,
          country,
          state,
          city,
          address1,
          address2,
          pinCode,
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
      const patientId = req.params.referenceId;
      const newService = await Holiday.findByIdAndDelete(patientId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = holidayController;
