// models/user.js
const mongoose = require("mongoose");

const medicationhistorySchema = new mongoose.Schema({
  medicationhistory: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const MedicationHistory = mongoose.model(
  "MedicationHistory",
  medicationhistorySchema
);
module.exports = MedicationHistory;
