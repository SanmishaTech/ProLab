const Department = require("../Schema/testMaster");
const User = require("../Schema/userSchema");
const Tatmaster = require("../Schema/tatmaster");
const mongoose = require("mongoose");
const WorkingHours = require("../Schema/workinghours");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const {
        name,
        code,
        abbrivation,
        specimen,
        prerquisite,
        price,
        department,
        consentForm,
        interpretedText,
        profile,
        machineInterface,
        sortOrder,
        isFormTest,
        isSinglePageReport,
        userId,
      } = req.body;
      const newService = new Department({
        name,
        code,
        abbrivation,
        specimen,
        prerquisite,
        price,
        department,
        consentForm,
        interpretedText,
        profile,
        machineInterface,
        sortOrder,
        isFormTest,
        isSinglePageReport,
        userId,
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
      const usertobefound = new mongoose.Types.ObjectId(userId);
      const doctor = await Department.find({ userId: usertobefound })
        .populate({
          path: "specimen",
        })
        .populate({
          path: "department",
        })
        .populate({
          path: "profile",
        });

      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const doctorId = req.params.testmasterId;
      const services = await Department.findById(doctorId)
        .populate({
          path: "specimen",
        })
        .populate({
          path: "department",
        });
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const doctorId = req.params.testmasterId;
      const {
        name,
        code,
        abbrivation,
        specimen,
        prerquisite,
        price,
        department,
        consentForm,
        interpretedText,
        profile,
        machineInterface,
        sortOrder,
        isFormTest,
        isSinglePageReport,
      } = req.body;

      const newService = await Department.findByIdAndUpdate(
        doctorId,
        {
          name,
          code,
          abbrivation,
          specimen,
          prerquisite,
          price,
          department,
          consentForm,
          interpretedText,
          profile,
          machineInterface,
          sortOrder,
          isFormTest,
          isSinglePageReport,
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
      const doctorId = req.params.testmasterId;
      const newService = await Department.findByIdAndDelete(doctorId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  searchbyName: async (req, res, next) => {
    try {
      const name = req.params.name;
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);

      // Use mongoose to find user first if necessary
      const userwithid = await User.findById(userId);
      if (!userwithid) {
        return res.status(404).json({ message: "User not found." });
      }

      const agg = [
        {
          $search: {
            index: "test", // Check if 'lab' is correctly configured in your MongoDB Atlas Search
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

      const patient = await Department.aggregate(agg);

      let tat;
      if (patient[0]?.name) {
        tat = await Tatmaster.find({
          userId: usertobefound,
          selectTest: patient[0]?._id,
        });
      }
      const workinghours = await WorkingHours.find({
        userId: usertobefound,
      });
      let calculatedTat;
      if (tat && workinghours.length > 0) {
        const startTime = new Date();
        const duration = tat[0]?.hoursNeeded || 0;
        const endTime = new Date(
          startTime.getTime() + duration * 60 * 60 * 1000
        );
        calculatedTat = endTime;
      }

      console.log("This is tat", calculatedTat);
      const combinebothdata = {
        tests: patient,
        tat: tat,
        calculatedTat: calculatedTat,
      };
      res.status(200).json(combinebothdata);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = Servicescontroller;
