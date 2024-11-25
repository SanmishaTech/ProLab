const Department = require("../Schema/userMasterSchema");
const mongoose = require("mongoose");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const {
        employeeCode,
        firstName,
        lastName,
        salutation,
        gender,
        role,
        address,
        address2,
        city,
        state,
        mobileNo,
        emailId,
        dob,
        collectionCenter,
        signatureText,
        modifyTest,
        reportPrint,
        sampleRejection,
        reportPdf,
      } = req.body;
      const newService = new Department({
        employeeCode,
        firstName,
        lastName,
        salutation,
        gender,
        role,
        address,
        address2,
        city,
        state,
        mobileNo,
        emailId,
        dob,
        collectionCenter,
        signatureText,
        modifyTest,
        reportPrint,
        sampleRejection,
        reportPdf,
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
      console.log("This is parameter");
      const doctor = await Department.find()
        .populate({
          path: "test",
        })
        .populate({
          path: "parameterGroup",
        })
        .populate({
          path: "parameter",
        });
      // .populate({
      //   path: "services",
      //   populate: { path: "services" },
      // });
      console.log(doctor);

      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const doctorId = req.params.referenceId;
      const services = await Department.findById(doctorId)
        .populate({
          path: "test",
        })
        .populate({
          path: "parameterGroup",
        })
        .populate({
          path: "parameter",
        });
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const doctorId = req.params.departmentId;
      const { test, parameterGroup, parameter } = req.body;

      const newService = await Department.findByIdAndUpdate(
        doctorId,
        {
          test,
          parameterGroup,
          parameter,
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
      const doctorId = req.params.specimenId;
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
