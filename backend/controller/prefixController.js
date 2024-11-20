const Prefix = require("../Schema/prefixSetup"); // Assuming the Prefix model is in the models folder
const mongoose = require("mongoose");

// CREATE a new Prefix
exports.createPrefix = async (req, res) => {
  try {
    const {
      prefixFor,
      prefix,
      suffix,
      separator,
      digits,
      startNumber,
      resetToStart,
    } = req.body;

    // Ensure the prefixFor value is valid
    if (!["sid", "patient", "invoice"].includes(prefixFor)) {
      return res.status(400).json({ message: "Invalid prefixFor value" });
    }

    // Check if a prefix configuration already exists for this type
    const existingPrefix = await Prefix.findOne({ prefixFor });
    if (existingPrefix) {
      return res.status(400).json({ 
        message: `A prefix configuration for ${prefixFor} already exists. Please use update instead.` 
      });
    }

    // Create a new Prefix document
    const newPrefix = new Prefix({
      prefixFor,
      prefix,
      suffix,
      separator,
      digits,
      startNumber,
      resetToStart,
    });

    // Save the document to the database
    const savedPrefix = await newPrefix.save();
    res.status(201).json(savedPrefix);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create prefix", error });
  }
};

// READ all Prefixes for a specific prefixFor (e.g., SID, PatientID, or InvoiceID)
exports.getPrefixesByType = async (req, res) => {
  const { prefixFor } = req.params; // Get the prefixFor from the route parameter

  if (!["sid", "patient", "invoice"].includes(prefixFor)) {
    return res.status(400).json({ message: "Invalid prefixFor value" });
  }

  try {
    const prefixes = await Prefix.find({ prefixFor }); // Filter by prefixFor
    res.status(200).json(prefixes); // Respond with the list of prefixes
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch prefixes", error });
  }
};

// READ a single Prefix by ID and prefixFor
exports.getPrefixByIdAndType = async (req, res) => {
  const { id, prefixFor } = req.params; // Get the id and prefixFor from the route parameters

  if (!["sid", "patient", "invoice"].includes(prefixFor)) {
    return res.status(400).json({ message: "Invalid prefixFor value" });
  }

  try {
    const prefix = await Prefix.findOne({ _id: id, prefixFor }); // Find by both ID and prefixFor
    if (!prefix) {
      return res.status(404).json({ message: "Prefix not found" });
    }
    res.status(200).json(prefix); // Respond with the found prefix
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch prefix", error });
  }
};

// UPDATE a Prefix by ID and prefixFor
exports.updatePrefixByType = async (req, res) => {
  const { id, prefixFor } = req.params; // Get the id and prefixFor from the route parameters
  const { prefix, suffix, separator, digits, startNumber, resetToStart } =
    req.body;

  if (!["sid", "patient", "invoice"].includes(prefixFor)) {
    return res.status(400).json({ message: "Invalid prefixFor value" });
  }

  try {
    const updatedPrefix = await Prefix.findOneAndUpdate(
      { _id: id, prefixFor }, // Match by both ID and prefixFor
      {
        prefix,
        suffix,
        separator,
        digits,
        startNumber,
        resetToStart,
      },
      { new: true } // Return the updated document
    );

    if (!updatedPrefix) {
      return res.status(404).json({ message: "Prefix not found" });
    }

    res.status(200).json(updatedPrefix); // Respond with the updated prefix
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update prefix", error });
  }
};

// DELETE a Prefix by ID and prefixFor
exports.deletePrefixByType = async (req, res) => {
  const { id, prefixFor } = req.params; // Get the id and prefixFor from the route parameters

  if (!["sid", "patient", "invoice"].includes(prefixFor)) {
    return res.status(400).json({ message: "Invalid prefixFor value" });
  }

  try {
    const deletedPrefix = await Prefix.findOneAndDelete({ _id: id, prefixFor }); // Delete by both ID and prefixFor
    if (!deletedPrefix) {
      return res.status(404).json({ message: "Prefix not found" });
    }
    res.status(200).json({ message: "Prefix deleted successfully" }); // Respond with success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete prefix", error });
  }
};
