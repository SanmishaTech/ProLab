const mongoose = require("mongoose");

const labMaster = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  employeeCode: { type: String },
  email: { type: String },
  mobileNo: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  address1: { type: String },
  address2: { type: String },
  pinCode: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const LabMaster = mongoose.model("LabMaster", labMaster);
module.exports = LabMaster;
