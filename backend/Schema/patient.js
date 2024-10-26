// models/user.js
const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: Date },
  phone: { type: String },
  gender: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
