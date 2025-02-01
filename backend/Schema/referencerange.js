// models/user.js
const mongoose = require("mongoose");

const reference = new mongoose.Schema({
  parameter: { type: mongoose.Schema.Types.ObjectId, ref: "Parameter" },
  testName: { type: String },
  gender: { type: String },
  agefrom: { type: String },
  ageto: { type: String },
  agetype: { type: String },
  normalRange: { type: String },
  normalRangeHi: { type: String },
  normalRangeLow: { type: String },
  criticalRange: { type: String },
  criticalRangeHi: { type: String },
  criticalRangeLow: { type: String },
  remark: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Referencerange = mongoose.model("ReferenceRange", reference);
module.exports = Referencerange;
