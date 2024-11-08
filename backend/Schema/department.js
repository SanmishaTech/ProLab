// models/holiday.js

const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  adn: { type: String, required: true },
});

const Department = mongoose.model("Department", departmentSchema);
module.exports = Department;
