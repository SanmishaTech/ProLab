const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const patientMasterSchema = new mongoose.Schema({
  patientId: { type: String },
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
  value: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  percentage: { type: Number },
});

// Add auto-increment plugin for the `sid` field
patientMasterSchema.plugin(AutoIncrement, { inc_field: "sid" });

const PatientMaster = mongoose.model("PatientMaster", patientMasterSchema);
module.exports = PatientMaster;
