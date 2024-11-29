const Department = require("../Schema/userMasterSchema");
const mongoose = require("mongoose");
const User = require("../Schema/userSchema");
const bcrypt = require("bcrypt");

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
        pincode,
        state,
        mobileNo,
        emailId,
        country,
        dob,
        collectionCenter,
        signatureText,
        modifyTest,
        reportPrint,
        sampleRejection,
        reportPdf,
        username,
        email,
        password,
      } = req.body;
      const saltRounds = 10;

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newuser = new User({
        username,
        email,
        passwordHash: hashedPassword,
      });
      const newUser = await newuser.save();

      const newService = new Department({
        employeeCode,
        firstName,
        lastName,
        salutation,
        pincode,
        gender,
        role,
        address,
        country,
        user: newUser?._id,
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
      const doctor = await Department.find().populate({
        path: "user",
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
      const doctorId = req.params.testmasterId;
      const services = await Department.findById(doctorId).populate({
        path: "user",
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
        employeeCode,
        firstName,
        lastName,
        salutation,
        gender,
        role,
        pincode,
        address,
        address2,
        city,
        state,
        mobileNo,
        emailId,
        dob,
        collectionCenter,
        signatureText,
        country,
        modifyTest,
        reportPrint,
        sampleRejection,
        reportPdf,
      } = req.body;

      const newService = await Department.findByIdAndUpdate(
        doctorId,
        {
          employeeCode,
          firstName,
          country,
          lastName,
          salutation,
          pincode,
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
