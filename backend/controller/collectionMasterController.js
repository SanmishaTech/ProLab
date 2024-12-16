const Container = require("../Schema/collectionMaster");
const mongoose = require("mongoose");

const ContainerController = {
  createThread: async (req, res, next) => {
    try {
      const {
        collectionName,
        address1,
        address2,
        country,
        state,
        city,
        pinCode,
        telephone,
        emailId,
        contactName1,
        contactName2,
        prefix,
        suffix,
        noOfDigits,
        mobileNo,
        startNumber,
        userId,
      } = req.body;
      const newContainer = new Container({
        collectionName,
        address1,
        address2,
        country,
        state,
        city,
        pinCode,
        telephone,
        emailId,
        contactName1,
        contactName2,
        prefix,
        suffix,
        noOfDigits,
        mobileNo,
        startNumber,
        userId,
      });
      const newServics = await newContainer.save();
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
      const doctor = await Container.find({ userId: usertobefound });

      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const doctorId = req.params.collectionMaster;
      const services = await Container.findById(doctorId);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const doctorId = req.params.collectionMaster;
      const {
        collectionName,
        address1,
        address2,
        country,
        state,
        city,
        pinCode,
        telephone,
        emailId,
        contactName1,
        contactName2,
        prefix,
        suffix,
        noOfDigits,
        mobileNo,
        startNumber,
        userId,
      } = req.body;

      const newService = await Container.findByIdAndUpdate(
        doctorId,
        {
          collectionName,
          address1,
          address2,
          country,
          state,
          city,
          pinCode,
          telephone,
          emailId,
          contactName1,
          contactName2,
          prefix,
          suffix,
          noOfDigits,
          mobileNo,
          startNumber,
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
      const doctorId = req.params.collectionMaster;
      const newService = await Container.findByIdAndDelete(doctorId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = ContainerController;
