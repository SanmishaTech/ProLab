// models/user.js
const mongoose = require("mongoose");

const testschema = new mongoose.Schema({
  Tests: { type: mongoose.Schema.Types.ObjectId, ref: "TestMaster" },
  dateTime: { type: Date, default: Date.now },
});

const sampleMasterschema = new mongoose.Schema({
  Registration: { type: mongoose.Schema.Types.ObjectId, ref: "Registration" },
  Tests: [testschema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const SampleMasterschema = mongoose.model(
  "Samplecollectionmaster",
  sampleMasterschema
);
module.exports = SampleMasterschema;
