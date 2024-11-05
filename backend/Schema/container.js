// models/holiday.js

const mongoose = require("mongoose");

const specimenSchema = new mongoose.Schema({
  container: { type: String },
});

const Container = mongoose.model("Container", specimenSchema);
module.exports = Container;
