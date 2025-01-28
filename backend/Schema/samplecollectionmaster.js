// models/user.js
const mongoose = require("mongoose");

const testschema = new mongoose.Schema({
<<<<<<< HEAD
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestMaster",
  },
=======
  test: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestMaster",
    },
  ],
>>>>>>> 7a35450 (asd)
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
<<<<<<< HEAD
=======
      unique: true, // Enforce one record per registrationId
>>>>>>> 7a35450 (asd)
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
