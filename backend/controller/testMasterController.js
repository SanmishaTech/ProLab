const Department = require("../Schema/testMaster");
const mongoose = require("mongoose");

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
      // const userId = req.params.userId;
      // const usertobefound = new mongoose.Types.ObjectId(userId);
      const doctor = await Department.find();
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
};
module.exports = Servicescontroller;
