const Highlighter = require("../Schema/highlighter");
const mongoose = require("mongoose");

const highlighterController = {
  createThread: async (req, res, next) => {
    try {
      const { useBoldFonts,useUnderline,backgroundColor,highLowValues } = req.body;
      const newService = new Highlighter({
        useBoldFonts,
        useUnderline,
        backgroundColor,
        highLowValues
      });
      const newServics = await newService.save();

      res.json({
        message: "Highlighter created successfully",
        service: newServics,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServices: async (req, res, next) => {
    try {
      const highlighter = await Highlighter.find();
      res.status(200).json(highlighter);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getServicesbyId: async (req, res, next) => {
    try {
      const highlighterID = req.params.highlighterId;
      const services = await Highlighter.findById(highlighterID);
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateThreads: async (req, res, next) => {
    try {
      const highlighterID = req.params.highlighterId;
      const { useBoldFonts,useUnderline,backgroundColor,highLowValues } = req.body;
      const newService = await Highlighter.findByIdAndUpdate(
        highlighterID,
        {
          useBoldFonts,
          useUnderline,
          backgroundColor,
          highLowValues
        },
        { new: true }
      );
      if (!newService) {
        return res.status(404).json({ message: "Highlighter not found." });
      }

      res.json({ message: "highlighter updated successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteThread: async (req, res, next) => {
    try {
      const patientId = req.params.highlighterId;
      const newService = await Highlighter.findByIdAndDelete(patientId);
      if (!newService) {
        return res.status(404).json({ message: "Service not found." });
      }

      res.json({ message: "Service deleted successfully.", newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
module.exports = highlighterController;
