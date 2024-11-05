// models/holiday.js

const mongoose = require("mongoose");

const specimenSchema = new mongoose.Schema({
  specimen: { type: String },
});

const Specimen = mongoose.model("Specimen", specimenSchema);
module.exports = Specimen;
