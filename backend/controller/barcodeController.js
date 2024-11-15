const Barcode = require("../Schema/barcode");
const mongoose = require("mongoose");

const barcodeController = {
  createThread: async (req, res, next) => {
    try {
      const { patientName,patientId,sid,dateOfAppointment, timeOfAppointment, testName, testAbbreviation, container } = req.body;
      const newService = new Barcode({
        patientName,
        patientId,
        sid,
        dateOfAppointment,
        timeOfAppointment,
        testName,
        testAbbreviation,
        container,
      });
      const newServics = await newService.save();

      res.json({
        message: "Barcode created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const barcode = await Barcode.find();
      res.status(200).json(barcode);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const barcodeID = req.params.barcodeId;
      const services = await Barcode.findById(barcodeID);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const barcodeID = req.params.barcodeId;
      const { patientName,patientId,sid,dateOfAppointment, timeOfAppointment, testName, testAbbreviation, container } = req.body;
      const newService = await Barcode.findByIdAndUpdate(
        barcodeID,
        {
          patientName,
          patientId,
          sid,
          dateOfAppointment,
          timeOfAppointment,
          testName,
          testAbbreviation, 
          container
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Barcode not found." });
      }

      res.json({ message: "barcode updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = barcodeController;
