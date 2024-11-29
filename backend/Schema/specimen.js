// models/holiday.js

const mongoose = require("mongoose");

const specimenSchema = new mongoose.Schema({
  specimen: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Specimen = mongoose.model("Specimen", specimenSchema);
module.exports = Specimen;
