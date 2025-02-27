// models/holiday.js

const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  adn: { type: String, required: true },
  interpretation: { type: Boolean, default: false },
  approval: { type: Boolean, default: false },
  referenceNo: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;
