// models/holiday.js

const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  adn: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;
