// models/user.js
const mongoose = require("mongoose");

const collectionMaster = new mongoose.Schema({
  collectionName: { type: String },
  address1: { type: String },
  address2: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  pinCode: { type: String },
  telephone: { type: String },
  contactName1: { type: String },
  contactName2: { type: String },
  prefix: { type: String },
  suffix: { type: String },
  seperator: { type: String },
  noOfDigits: { type: String },
  startNumber: { type: String },
  emailId: { type: String },
  mobileNo: { type: String },
  printReport: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const CollectionMaster = mongoose.model("CollectionMaster", collectionMaster);
module.exports = CollectionMaster;
