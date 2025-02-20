// models/user.js
const mongoose = require("mongoose");

const ClinicalHistorySchema = new mongoose.Schema({
  clinic: { type: String, default: false },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ClinicalHistory = mongoose.model(
  "ClinicalHistory",
  ClinicalHistorySchema
);
module.exports = ClinicalHistory;
