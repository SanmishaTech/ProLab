// models/holiday.js

const mongoose = require("mongoose");

const associateSchema = new mongoose.Schema({
  associateType: { type: String },
  salutation: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  organization: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  address: { type: String },
  telephone: { type: String },
  mobile: { type: String },
  email: { type: String },
  degree: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const AssociateMaster = mongoose.model("AssociateMaster", associateSchema);
module.exports = AssociateMaster;
