// models/holiday.js

const mongoose = require("mongoose");

const holidaySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  date: { type: Date },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Holiday = mongoose.model("Holiday", holidaySchema);
module.exports = Holiday;
