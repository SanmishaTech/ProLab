// models/user.js
const mongoose = require("mongoose");

const testschema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestMaster",
  },
  status: {
    type: String,
    enum: ["pending", "collected", "rejected"],
    default: "pending",
  },
  rejectionReason: {
    type: String,
    default: null,
  },
  collectedAt: {
    type: Date,
    default: null,
  },
  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
});

const sampleMasterschema = new mongoose.Schema(
  {
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PatientMaster",
    },
    tests: [testschema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const SampleMasterschema = mongoose.model(
  "Samplecollectionmaster",
  sampleMasterschema
);
module.exports = SampleMasterschema;
