const mongoose = require("mongoose");

const accessionSchema = new mongoose.Schema({
  registrationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Registration",
    required: true 
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestMaster",
    required: true
  },
  sampleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Samplecollectionmaster",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  rejectionReason: {
    type: String,
    default: null
  },
  collectedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date,
    default: null
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Accession = mongoose.model("Accession", accessionSchema);
module.exports = Accession; 