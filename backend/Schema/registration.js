// models/registration.js

const mongoose = require("mongoose");

const serviceEntrySchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service", // Corrected reference
    required: true,
  },
  urgent: { type: Boolean, default: false },
});

const registrationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    referral: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reference",
    },
    services: [serviceEntrySchema], // Modified to include urgency per service
    paymentMode: {
      paymentMode: {
        type: String,
        enum: ["Cash", "CC/DC", "UPI"], // Added enum for validation
        required: true,
      },
      paidAmount: { type: Number, required: true },
      upiNumber: { type: String }, // Applicable if paymentMode is UPI
      referenceNumber: { type: String }, // Applicable if paymentMode is CC/DC
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completionDays: { type: Number, required: true }, // Calculated field
    completionDate: { type: Date, required: true }, // Exact completion date
    totalAmount: { type: Number, required: true }, // Total amount considering urgent pricing
  },
  { timestamps: true }
);

const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration;
