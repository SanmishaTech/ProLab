// models/holiday.js

const mongoose = require("mongoose");

const userMasterSchema = new mongoose.Schema({
  employeeCode: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  salutation: { type: String },
  gender: { type: String },
  department: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
  role: { type: String },
  address: { type: String },
  address2: { type: String },
  city: { type: String },
  state: { type: String },
  mobileNo: { type: String },
  emailId: { type: String },
  dob: { type: Date },
  collectionCenter: [
    { type: mongoose.Schema.Types.ObjectId, ref: "CollectionCenter" },
  ],
  signatureText: { type: String },
  modifyTest: { type: Boolean },
  reportPrint: { type: Boolean },
  sampleRejection: { type: Boolean },
  reportPdf: { type: Boolean },
});

const UserMaster = mongoose.model("UserMaster", userMasterSchema);
module.exports = UserMaster;
