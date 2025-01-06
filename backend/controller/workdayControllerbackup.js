const Workingdays = require("../Schema/workingdays");
const mongoose = require("mongoose");
const User = require("../Schema/userSchema");
const bcrypt = require("bcrypt");

const Servicescontroller = {
  createThread: async (req, res, next) => {
    try {
      const {
        breakFrom,
        breakTo,
        timeFrom,
        timeTo,
        day,
        nonWorkingDay,
        userId,
      } = req.body;

      const usertobefound = new mongoose.Types.ObjectId(userId);
      console.log("This is parameter");
      const doctor = await Workingdays.find({ userId: usertobefound });

      if (doctor) {
        const newservices = Workingdays.updateOne(
          { userId: usertobefound },
          {
            breakFrom,
            breakTo,
            timeFrom,
            timeTo,
            day,
            nonWorkingDay,
            userId,
          }
        );
        res.json({
          message: "Working Days updated successfully",
          service: newservices,
        });
      } else {
        const newService = new Workingdays({
          breakFrom,
          breakTo,
          timeFrom,
          timeTo,
          day,
          nonWorkingDay,
          userId,
        });
        const newServics = await newService.save();
        res.json({
          message: "Working Days created successfully",
          service: newServics,
        });
      }

      const newuser = new Workingdays({
        breakFrom,
        breakTo,
        timeFrom,
        timeTo,
        day,
        nonWorkingDay,
        userId,
      });
      const newUser = await newuser.save();

      res.json({
        message: "Working Days created successfully",
        service: newUser,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const userId = req.params.userId;
      const usertobefound = new mongoose.Types.ObjectId(userId);
      console.log("This is parameter");
      const doctor = await Workingdays.find({ userId: usertobefound });

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
