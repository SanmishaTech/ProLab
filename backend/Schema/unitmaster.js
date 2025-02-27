// models/user.js
const mongoose = require("mongoose");

const UnitMasterschema = new mongoose.Schema({
  unit: { type: String },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Unitmaster = mongoose.model("UnitMaster", UnitMasterschema);
module.exports = Unitmaster;
