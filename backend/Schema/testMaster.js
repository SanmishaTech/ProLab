// models/holiday.js

const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  name: { type: String },
  code: { type: String },
  abbrivation: { type: String },
  specimen: { type: mongoose.Schema.Types.ObjectId, ref: "Specimen" },
  prerquisite: { type: String },
  price: { type: Number },
  consentForm: { type: String },
  interpretedText: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  profile: [{ type: mongoose.Schema.Types.ObjectId, ref: "TestMaster" }],
  machineInterface: { type: Boolean },
  sortOrder: { type: Number },
  isFormTest: { type: Boolean },
  isSinglePageReport: { type: Boolean },
});

const TestMaster = mongoose.model("TestMaster", testSchema);
module.exports = TestMaster;
