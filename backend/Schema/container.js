// models/holiday.js

const mongoose = require("mongoose");

const specimenSchema = new mongoose.Schema({
  container: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Container = mongoose.model("Container", specimenSchema);
module.exports = Container;
