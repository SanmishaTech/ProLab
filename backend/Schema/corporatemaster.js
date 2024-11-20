// models/corporatemaster.js

const mongoose = require("mongoose");

const corporateSchema = new mongoose.Schema({
  corporateCode: { type: String },
  corporateName: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  address: { type: String },
  discount: { type: String },
  value: { type: Number },
});

const CorporateMaster = mongoose.model("CorporateMaster", corporateSchema);
module.exports = CorporateMaster;
  