// models/holiday.js

const mongoose = require("mongoose");

const patientMasterSchema = new mongoose.Schema({
  hfaId: { type: String },
  salutation: { type: String },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  address: { type: String },
  mobile: { type: String },
  email: { type: String },
  dateOfBirth: { type: Date },
  age: { type: Number },
  gender: { type: String },
  ageType: { type: String },
  patientType: { type: String },
  bloodGroup: { type: String },
  maritalStatus: { type: String },
  priorityCard: { type: Boolean },
});

const PatientMaster = mongoose.model("PatientMaster", patientMasterSchema);
module.exports = PatientMaster;