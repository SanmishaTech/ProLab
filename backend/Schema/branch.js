// models/user.js
const mongoose = require("mongoose");

const branchMasterSchema = new mongoose.Schema({
  mainBranch: { type: Boolean, default: false },
  branchName: { type: String, default: "" },
  branchCode: { type: String, default: "" },
  address1: { type: String, default: "" },
  address2: { type: String, default: "" },
  pinCode: { type: String, default: "" },
  country: { type: String, default: "" },
  state: { type: String, default: "" },
  city: { type: String, default: "" },
  contactPerson1: { type: String, default: "" },
  contactPerson2: { type: String, default: "" },
  designation1: { type: String, default: "" },
  designation2: { type: String, default: "" },
  contactNumber1: { type: String, default: "" },
  contactNumber2: { type: String, default: "" },
  fax: { type: String, default: "" },
  emailId: { type: String, default: "" },
  alternateEmailId: { type: String, default: "" },
  currency: { type: String, default: "" },
  syncStatus: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Barcode = mongoose.model("BranchMaster", branchMasterSchema);
module.exports = Barcode;
